import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { VmgSourceComponentDefinition, VmgSourceComponentRenderProps, VmgCustomNode, VmgProject, VmgSourceFontDeclaration } from '@base_bit/vmg-sdk';
import './scene.css';

type CameraData = { cameraX: number; cameraY: number; distance: number; yaw: number; pitch: number; roll: number; focal: number; background: string; grain: number; heading: string; period: string; note: string; footerBrand: string; footerYear: string };
type CardData = { title: string; english: string; detail: string; badge: string; number: string; color: string; colorEnd: string; kind: string; icon: string; image: string; logo: string; depth: number; tilt: number; light: number; credit: string; yearLabel: string; yearCaption: string };
type LinkData = { from: string; to: string; route: string; lane: number; progress: number; color: string; thickness: number; brightness: number };
type CaptionData = { text: string; kicker: string; color: string };
type Point3 = { x: number; y: number; z: number };
type SceneCard = { node: VmgCustomNode; data: CardData; x: number; y: number; width: number; height: number; sx: number; sy: number; rotation: number; opacity: number };
const CARD = 'studio.evergrande.card', LINK = 'studio.evergrande.link', CAPTION = 'studio.evergrande.caption';
const rad = (a: number) => a * Math.PI / 180;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    estate: <><path d="M9 53V17L30 7v46M30 23h25v30M16 23h7m-7 10h7m-7 10h7m15-11h9m-9 10h9M5 55h54"/><path d="M39 53v-8h8v8"/></>,
    property: <><path d="M8 28 32 8l24 20M15 25v29h34V25M27 54V37h10v17"/><path d="m42 13 6-5 8 6-1 10-7 5-7-5V14"/></>,
    car: <><path d="m10 40 5-15h34l6 15v12H9V40Zm7-15 6-12h20l6 12M10 38h45M17 47h8m15 0h8"/><path d="M13 52v5h8v-5m22 0v5h8v-5"/></>,
    tourism: <path d="M10 55V27h12v28M42 55V27h12v28M25 55V18h14v37M7 27l9-12 9 12m14 0 9-12 9 12M22 18 32 5l10 13M29 55V40h6v15M5 55h54"/>,
    film: <><rect x="7" y="10" width="50" height="44" rx="3"/><path d="M7 21h50M17 10l-7 11m21-11-7 11m21-11-7 11m18-11-7 11m-21 9 14 9-14 9Z"/></>,
    trade: <path d="M8 22h44m-9-9 10 9-10 9M56 43H12m9-9-10 9 10 9"/>,
    health: <><path d="M32 55 10 34C-3 18 16 4 32 20 48 4 67 18 54 34Z"/><path d="M32 26v19M22 35h20"/></>,
    water: <><path d="M32 5C26 16 13 28 13 40a19 19 0 0 0 38 0C51 28 38 16 32 5Z"/><path d="M21 39c0 8 4 12 11 12"/></>,
  };
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.estate}</svg>;
}

function collectCards(nodes: VmgProject['nodes']): SceneCard[] {
  const map = new Map(nodes.map(n => [n.id, n]));
  return nodes.flatMap(n => {
    if (n.type !== 'custom' || n.props.componentId !== CARD || !n.transform.visible) return [];
    let x = n.transform.x, y = n.transform.y, sx = n.transform.scaleX, sy = n.transform.scaleY;
    let rotation = n.transform.rotation, opacity = n.transform.opacity, parentId = n.parentId;
    const seen = new Set<string>();
    while (parentId && !seen.has(parentId)) {
      seen.add(parentId);
      const p = map.get(parentId);
      if (!p) break;
      const a = rad(p.transform.rotation), xx = x * p.transform.scaleX, yy = y * p.transform.scaleY;
      x = p.transform.x + xx * Math.cos(a) - yy * Math.sin(a);
      y = p.transform.y + xx * Math.sin(a) + yy * Math.cos(a);
      sx *= p.transform.scaleX; sy *= p.transform.scaleY; rotation += p.transform.rotation;
      opacity *= p.transform.visible ? p.transform.opacity : 0; parentId = p.parentId;
    }
    return [{ node: n, data: n.props.data as CardData, x, y, width: n.transform.width, height: n.transform.height, sx, sy, rotation, opacity }];
  });
}

function projectPoint(p: Point3, c: CameraData, width: number, height: number) {
  let x = p.x - c.cameraX, y = p.y - c.cameraY, z = p.z;
  const ya = rad(-c.yaw), pa = rad(-c.pitch), ra = rad(-c.roll);
  [x, z] = [x * Math.cos(ya) + z * Math.sin(ya), -x * Math.sin(ya) + z * Math.cos(ya)];
  [y, z] = [y * Math.cos(pa) - z * Math.sin(pa), y * Math.sin(pa) + z * Math.cos(pa)];
  [x, y] = [x * Math.cos(ra) - y * Math.sin(ra), x * Math.sin(ra) + y * Math.cos(ra)];
  const scale = c.focal / Math.max(20, c.distance - z);
  return { x: width / 2 + x * scale, y: height / 2 + y * scale, scale };
}

function cardAnchor(card: SceneCard, localX: number, localY: number): Point3 {
  const rotation = rad(card.rotation), tilt = rad(card.data.tilt);
  const sx = localX * card.sx, sy = localY * card.sy;
  const x = sx * Math.cos(rotation) - sy * Math.sin(rotation);
  const y = sx * Math.sin(rotation) + sy * Math.cos(rotation);
  return { x: card.x + x * Math.cos(tilt), y: card.y + y, z: card.data.depth - x * Math.sin(tilt) };
}

function pathPoints(a: SceneCard, b: SceneCard, data: LinkData): Point3[] {
  const start = cardAnchor(a, 0, a.height / 2);
  const end = cardAnchor(b, 0, -b.height / 2);
  if (data.route === 'outside') {
    const x = 1630, s = cardAnchor(a, a.width / 2, 0);
    return [s, { x, y: s.y, z: s.z }, { x, y: data.lane, z: s.z }, { x: end.x, y: data.lane, z: s.z }, end];
  }
  // Aligned cards need one straight spatial segment. A detour through z = 0
  // introduces a visible kink when the camera or card depth changes.
  if (Math.abs(start.x - end.x) < 1e-6) return [start, end];
  // Shared branching corners stay in the source card's plane. Only the final
  // straight segment traverses the depth difference to the target card.
  return [start, { x: start.x, y: data.lane, z: start.z }, { x: end.x, y: data.lane, z: start.z }, end];
}

function CardFace({ card, assetUrl }: { card: SceneCard; assetUrl: (id: string) => string }) {
  const { data: d } = card, root = d.kind === 'root', mini = d.kind === 'leaf';
  const style = { '--card-color': d.color, '--card-end': d.colorEnd, '--light': d.light } as CSSProperties;
  return <div className={`eg-card ${root ? 'eg-root' : ''} ${mini ? 'eg-leaf' : ''}`} style={style}>
    <div className="eg-card-glass"/>
    {d.image && <div className="eg-photo"><img src={assetUrl(d.image)} alt=""/></div>}
    <div className="eg-card-topline"/>
    {root ? <>
      {d.logo && <div className="eg-root-logo"><img src={assetUrl(d.logo)} alt={`${d.title}标志`}/></div>}
      <div className="eg-root-type" style={{ left: d.logo ? 315 : 44 }}><div className="eg-root-kicker">{d.english}</div><div className="eg-root-title">{d.title}</div><div className="eg-root-detail">{d.detail}</div></div>
      <div className="eg-root-year">{d.yearLabel}<span>{d.yearCaption}</span></div>
    </> : <>
      {!mini && <div className="eg-card-index">{d.number}<span> / BUSINESS</span></div>}
      {!mini && <div className="eg-card-icon"><Icon name={d.icon}/></div>}
      <div className="eg-card-copy"><div className="eg-card-title">{d.title}</div><div className="eg-card-english">{d.english}</div>{d.detail && <div className="eg-card-detail">{d.detail}</div>}</div>
      {d.badge && <div className="eg-card-badge">{d.badge}</div>}
    </>}
    <span className="eg-corner eg-corner-tl"/><span className="eg-corner eg-corner-br"/>
  </div>;
}

function ArchitectureScene({ data: c, project, time, runtime, assetUrl }: VmgSourceComponentRenderProps<CameraData>) {
  const rootRef = useRef<HTMLDivElement>(null);
  runtime.frames.useParticipant({ phase: 'asset', element: () => rootRef.current, prepareFrame: async () => {
    const images = rootRef.current?.querySelectorAll('img') || [];
    await Promise.all(Array.from(images).map(img => runtime.scene.prepareImage(img)));
  }});
  const { nodes } = runtime.document.evaluateProject(project, time), cards = collectCards(nodes);
  const byId = new Map(cards.map(card => [card.node.id, card]));
  const width = project.canvas.width, height = project.canvas.height;
  const links = nodes.filter((n): n is VmgCustomNode => n.type === 'custom' && n.props.componentId === LINK && n.transform.visible);
  const captions = nodes.filter((n): n is VmgCustomNode => n.type === 'custom' && n.props.componentId === CAPTION && n.transform.visible);
  const worldTransform = `translateZ(${c.focal - c.distance}px) rotateZ(${-c.roll}deg) rotateX(${-c.pitch}deg) rotateY(${-c.yaw}deg) translate3d(${-c.cameraX}px, ${-c.cameraY}px, 0)`;
  const progress = Math.min(1, Math.max(0, time / project.duration));
  return <div ref={rootRef} className="eg-scene" style={{ width, height, background: c.background }}>
    <div className="eg-ambient"/><div className="eg-grid"/>
    <svg className="eg-grain" width={width} height={height} style={{ opacity: c.grain }}><filter id="eg-film-grain"><feTurbulence type="fractalNoise" baseFrequency="0.83" numOctaves="3" stitchTiles="stitch" seed="27"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#eg-film-grain)" opacity=".65"/></svg>
    <svg className="eg-lines" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {links.map(n => {
        const d = n.props.data as LinkData, a = byId.get(d.from), b = byId.get(d.to);
        if (!a || !b) return null;
        const points = pathPoints(a, b, d).map(p => projectPoint(p, c, width, height));
        const path = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' ');
        const scale = points.reduce((s, p) => s + p.scale, 0) / points.length;
        return <g key={n.id} opacity={n.transform.opacity * Math.min(1, b.opacity)} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={path} pathLength={1} stroke={d.color} opacity={d.brightness * .15} strokeWidth={d.thickness * scale * 4} strokeDasharray="1 1" strokeDashoffset={1 - d.progress}/>
          <path d={path} pathLength={1} stroke={d.color} opacity={d.brightness} strokeWidth={d.thickness * scale} strokeDasharray="1 1" strokeDashoffset={1 - d.progress}/>
          {d.progress > .99 && <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r={3.7 * scale} fill={d.color} opacity={.9}/>}
        </g>;
      })}
    </svg>
    <div className="eg-lens" style={{ perspective: c.focal, perspectiveOrigin: '50% 50%' }}><div className="eg-world" style={{ transform: worldTransform }}>
      {cards.map(card => <div key={card.node.id} className="eg-plane" style={{ left: card.x - card.width / 2, top: card.y - card.height / 2, width: card.width, height: card.height, opacity: card.opacity, transform: `translateZ(${card.data.depth}px) rotateY(${card.data.tilt}deg) rotateZ(${card.rotation}deg) scale(${card.sx},${card.sy})` }}><CardFace card={card} assetUrl={assetUrl}/></div>)}
    </div></div>
    <div className="eg-vignette"/>
    <div className="eg-header"><div className="eg-header-left"><i/>{c.heading}<span>BUSINESS ATLAS</span></div><div className="eg-header-right">{c.period}<b>历史业务版图</b></div></div>
    {captions.map(n => { const d = n.props.data as CaptionData; return <div key={n.id} className="eg-caption" style={{ opacity: n.transform.opacity, left: n.transform.x, top: n.transform.y, width: n.transform.width, color: d.color, transform: `translateY(${(1 - n.transform.opacity) * 14}px)` }}><div className="eg-caption-kicker">{d.kicker}</div><div className="eg-caption-text">{d.text}</div></div>; })}
    <div className="eg-footer"><div>{c.note}</div><div>{c.footerBrand}{c.footerYear && <><span> / </span>{c.footerYear}</>}</div></div>
    <div className="eg-progress"><div style={{ width: `${progress * 100}%` }}/></div>
  </div>;
}

const camera = {
  id: 'studio.evergrande.camera', version: '1.0.0', displayName: '3D 摄像机与空间舞台',
  defaultData: { cameraX: 0, cameraY: -510, distance: 1600, yaw: -8, pitch: 4, roll: -1, focal: 1500, background: '#070a0e', grain: .1, heading: '企业架构', period: '历史业务版图', note: '连接线表示业务关联', footerBrand: 'COMPANY', footerYear: '' },
  editable: [
    { path: 'cameraX', label: '镜头目标 X', control: 'number', keyframeable: true }, { path: 'cameraY', label: '镜头目标 Y', control: 'number', keyframeable: true },
    { path: 'distance', label: '镜头距离 Z', control: 'number', keyframeable: true }, { path: 'yaw', label: '水平环绕角', control: 'angle', keyframeable: true },
    { path: 'pitch', label: '俯仰角', control: 'angle', keyframeable: true }, { path: 'roll', label: '滚转角', control: 'angle', keyframeable: true },
    { path: 'focal', label: '透视焦距', control: 'number', keyframeable: true }, { path: 'heading', label: '页眉标题', control: 'text' },
    { path: 'period', label: '资料时期', control: 'text' }, { path: 'note', label: '口径说明', control: 'text' },
    { path: 'footerBrand', label: '页脚品牌', control: 'text' }, { path: 'footerYear', label: '页脚年份', control: 'text' },
    { path: 'background', label: '背景颜色', control: 'color' }, { path: 'grain', label: '颗粒透明度', control: 'number' },
  ],
  validate(v: unknown): v is CameraData { return object(v) && ['cameraX','cameraY','distance','yaw','pitch','roll','focal','grain'].every(k => typeof v[k] === 'number' && Number.isFinite(v[k])) && ['background','heading','period','note','footerBrand','footerYear'].every(k => typeof v[k] === 'string'); },
  render: ArchitectureScene,
} satisfies VmgSourceComponentDefinition<CameraData>;
const card = {
  id: 'studio.evergrande.card', version: '1.0.0', displayName: '产业卡片 · 3D 图层',
  defaultData: { title: '产业平台', english: 'BUSINESS PLATFORM', detail: '', badge: '', number: '01', color: '#146776', colorEnd: '#292661', kind: 'business', icon: 'estate', image: '', logo: '', depth: 0, tilt: 0, light: 1, credit: '', yearLabel: '', yearCaption: '' },
  editable: [
    { path: 'title', label: '中文名称', control: 'text' }, { path: 'english', label: '英文名称', control: 'text' }, { path: 'detail', label: '业务说明', control: 'text' },
    { path: 'badge', label: '注记', control: 'text' }, { path: 'number', label: '序号', control: 'text' }, { path: 'color', label: '左侧颜色', control: 'color' },
    { path: 'yearLabel', label: '年份标签', control: 'text' }, { path: 'yearCaption', label: '年份说明', control: 'text' },
    { path: 'colorEnd', label: '右侧颜色', control: 'color' }, { path: 'image', label: '实景图片', control: 'asset' }, { path: 'logo', label: '标志素材', control: 'asset' },
    { path: 'depth', label: '空间深度 Z', control: 'number', keyframeable: true }, { path: 'tilt', label: '卡片水平旋转', control: 'angle', keyframeable: true },
    { path: 'light', label: '照明强度', control: 'number', keyframeable: true }, { path: 'credit', label: '素材署名', control: 'text' },
  ],
  validate(v: unknown): v is CardData { return object(v) && ['title','english','detail','badge','number','color','colorEnd','kind','icon','image','logo','credit','yearLabel','yearCaption'].every(k => typeof v[k] === 'string') && ['depth','tilt','light'].every(k => typeof v[k] === 'number' && Number.isFinite(v[k])); }, render: () => null,
} satisfies VmgSourceComponentDefinition<CardData>;
const link = {
  id: 'studio.evergrande.link', version: '1.0.0', displayName: '跟随连接线 · 3D 路径',
  defaultData: { from: '', to: '', route: 'direct', lane: -300, progress: 1, color: '#d9e8ec', thickness: 3, brightness: .8 },
  editable: [
    { path: 'from', label: '起点图层 ID', control: 'text' }, { path: 'to', label: '终点图层 ID', control: 'text' }, { path: 'lane', label: '转折位置 Y', control: 'number', keyframeable: true },
    { path: 'progress', label: '线条生长', control: 'progress', keyframeable: true }, { path: 'color', label: '颜色', control: 'color' }, { path: 'thickness', label: '线宽', control: 'number' },
    { path: 'brightness', label: '亮度', control: 'number', keyframeable: true },
  ],
  validate(v: unknown): v is LinkData { return object(v) && ['from','to','route','color'].every(k => typeof v[k] === 'string') && ['lane','progress','thickness','brightness'].every(k => typeof v[k] === 'number' && Number.isFinite(v[k])); }, render: () => null,
} satisfies VmgSourceComponentDefinition<LinkData>;
const caption = {
  id: 'studio.evergrande.caption', version: '1.0.0', displayName: '解说字幕',
  defaultData: { text: '展开企业的业务版图。', kicker: 'BUSINESS ATLAS', color: '#f1f4f5' },
  editable: [{ path: 'text', label: '字幕', control: 'text' }, { path: 'kicker', label: '章节', control: 'text' }, { path: 'color', label: '颜色', control: 'color' }],
  validate(v: unknown): v is CaptionData { return object(v) && typeof v.text === 'string' && typeof v.kicker === 'string' && typeof v.color === 'string'; }, render: () => null,
} satisfies VmgSourceComponentDefinition<CaptionData>;
export const components = [camera, card, link, caption];
export const fonts = [
  { assetId: 'font-noto', family: 'Noto Sans SC', weight: 400, style: 'normal', cssVariable: '--vmg-font-noto' },
] satisfies VmgSourceFontDeclaration[];
export { standardSchema } from './standard';
