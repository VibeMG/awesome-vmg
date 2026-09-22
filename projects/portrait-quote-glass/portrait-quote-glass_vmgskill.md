---
name: portrait-quote-glass-vmg
description: 基于人物金句液态玻璃模板制作或改作人物介绍、访谈摘句与观点展示，处理换图改字、文字自适应尺寸、路径展开、玻璃材质和漂移动画之间的联动。
metadata:
  project-id: portrait-quote-glass
  project-version: "1.0.0"
  sdk-version: "0.0.7"
  cli-version: "0.0.7"
---

# 人物金句 · 液态玻璃模板 Skill

用于选中本模板后，把用户的人物图片、姓名、身份和金句放入可编辑工程，或继续调整布局、材质与运动。按当前用户要求修改；原有配色、尺寸、时长和动效均可调整。

本指南对应 [README](README.md) 中的 `portrait-quote-glass-v1.0.0` 发布包，目录 ID 为 `portrait-quote-glass`，工程版本 `1.0.0`，CLI / SDK 均为 `0.0.7`。原始画布为 1080×1920、60 fps、6.3 秒。下载、解包和素材许可见 README；以下源码路径均相对于解包后的工程。使用其他版本时，以实际源码和工程数据为准。

## 修改入口

`project.vmg.json` 保存当前实例参数、素材和关键帧；`src/standard.ts` 定义标准模式入口。仅替换内容、调整现有参数或改节奏时，修改工程数据即可。已有实例的值不会因修改组件 `defaultData` 自动更新，也不要用源码默认值覆盖用户已保存的设置。

| 需求 | 修改位置 |
| --- | --- |
| 替换人物 | `portrait.props.assetId`；适配与裁切在 `props.fit`、`contentScale`、`cropX`、`cropY`，图片框大小在该节点的 `transform.width/height`。 |
| 姓名与身份 | `person-name.props.text`、`person-role.props.text`；字体、字号、行高、颜色、对齐和文本框尺寸均由这两个原生文本节点控制。 |
| 金句与卡片排版 | `quote-card.props.data` 中的 `text`、`font`、`fontSize`、`lineHeight`、`autoSize`、`paddingX/Y`、`wrapWidth`、`manualWidth/Height`。实际实现为 `src/auto-card.tsx`。 |
| 人物底部渐隐 | `portrait` 的效果实例 `portrait-feather`：`effects.@portrait-feather.enabled`、`params.range`、`params.strength`。实现为 `src/portrait-fade.ts`。 |
| 背景图片与渐变 | `background.props.data.imageAssetId`、`imageEnabled`、`imageFit`、`imageOpacity`、`imageScale`、`imageX/Y`；渐变由 `topColor`、`middleColor`、`bottomColor`、`middleStop`、`angle` 控制。实现为 `src/background.tsx`。 |
| 玻璃材质、圆角与线条 | `quote-card.props.data` 中的 `thickness`、`refraction`、`blur`、`dispersion`、高光/着色参数，以及 `cornerRadius`、`lineWidth`、`lineColor`。 |
| 引号标记 | `quote-mark.props.data.color`、`path`；矢量组件位于 `src/quotation.tsx`。 |
| 整体位置 | `person-placement`、`name-placement`、`card-placement`、`quote-mark-placement` 的 `transform`。外层位置组与内层动画组分开，避免静态位置在播放时被轨道覆盖。 |

导入图片后使用项目的逻辑 asset ID，不把磁盘路径直接填入 `assetId`。替换素材通过 VMG 的资源操作维护资源版本和项目引用。效果的 `@portrait-feather` 是属性操作中按实例 ID 选取的语法；原始 JSON 的 `effects` 仍是数组。

`src/index.tsx` 注册组件、效果、字体和标准面板。新增或重命名节点、参数时，同步维护 `src/standard.ts` 中的 `binding`、`proTargets` 及相关轨道引用。此版本没有字幕和顶部“划重点”标识；按用户的新需求决定是否添加。

## 文字自适应与字体

卡片组件 ID 为 `studio.portrait-quote.auto-card`，其 `cardLayout` 根据完整金句计算尺寸：

- `autoSize: true` 时，宽度为最长一行的字形宽度加两侧 `paddingX`；高度为行数 × `fontSize` × `lineHeight` 加上下 `paddingY`，文字尺寸向上取整。
- 换行符始终生效；`wrapWidth > 0` 时按字形宽度逐字折行，这个值是文字区域宽度，不含内边距。`wrapWidth: 0` 表示不限制自动换行宽度。
- `autoSize: false` 时，外框使用 `manualWidth`、`manualHeight`，文字仍按现有换行规则排布。
- 尺寸由完整文本计算，`textProgress` 只控制已显示的字符数，逐字显现时卡片不会跟着跳动。

自动尺寸发生在组件内部，不会回写 `quote-card.transform.width/height`。卡片在组件局部坐标中左侧固定，纵向以 `node.transform.height / 2` 为中心展开；只改节点框宽度不会改掉自动计算的玻璃宽度。要增大留白，改内边距；要指定外框尺寸，关闭自动尺寸后改手动宽高；要换构图，调整位置组。姓名与身份是独立文本节点，其文本框不会随金句卡片自动变化。

| `quote-card.props.data.font` | 字体资源与声明 | CSS 变量 |
| --- | --- | --- |
| `condensed` | `font-glow-heavy`：未来荧黑·窄体，实际文件为 Bold，700 | `--vmg-font-quote` |
| `normal` | `font-glow-bold`：未来荧黑，Bold，700 | `--vmg-font-label` |
| `serif` | `font-source-serif`：思源宋体，Regular，400 | `--vmg-font-name` |

姓名与身份使用 `props.fontFamily` 中的中文字体名称；金句使用上表的选择值。`src/font-metrics.ts` 保存这三份字体的字形 advance，按 1000 单位归一化；缺失字符按一个字号的宽度估算。换用新的字体文件或实际字重时，同步更新字体资源、`src/index.tsx` 声明及对应度量表，才能让计算宽度与显示字体一致。仅换字体名称不会重新计算度量表。

## 线条、玻璃展开与时间轴

线条与玻璃属于同一个自适应组件。SVG 路径的终点来自实时计算的卡片宽度，`drawProgress` 通过路径描边控制从左向右绘制；`expansion` 随后把玻璃实际高度从线宽插值到完整卡片高度。两段进度独立，文字变化后不需要手工重画一条固定长度的线。

这段展开使用几何尺寸，`cornerRadius` 保持独立的逻辑半径；玻璃很薄时，着色器会将有效半径限制在当前宽高的一半以内。保留这种展开方式时，应调整 `expansion` 轨道，而不是改用 `scaleY`。整体组缩放会同时缩放文字、线宽和圆角，需要按用户的目标区别处理。

以下是 1.0.0 工程的原始时序，均为 `quote-card` 的 `props.data.*` 轨道：

| 属性 | 变化区间 | 原始值与曲线 |
| --- | --- | --- |
| `drawProgress` | 1.92–2.55 秒 | 0→1，cubic-bezier(0.4, 0, 0.2, 1) |
| `expansion` | 2.55–3.58 秒 | 0→1，cubic-bezier(0.32, 0, 0.18, 1) |
| `textOpacity` | 3.58–3.91 秒 | 0→1，cubic-bezier(0.22, 1, 0.36, 1) |
| `textProgress` | 3.65–4.50 秒 | 0→1，linear |
| `glowRadius` | 3.65–4.65 秒 | 22→8，cubic-bezier(0.22, 1, 0.36, 1) |
| `sweepProgress` | 2.55–3.95 秒 | 0→1，sine-in-out |

保持“先画满线再展开”的关系时，让 `drawProgress` 到达 1 的时间与 `expansion` 离开 0 的时间衔接。调整节奏时同时考虑文字显现、发光和扫光轨道；只改静态进度会被播放中的关键帧覆盖。整体改变时长时，按目标同步处理相关关键帧、`duration` 和 `playback.start/end`。

轻微移动来自独立层级和轨道：

- 人物：`person-placement → person-drift → person-motion → portrait`。`person-motion` 控制入场；`person-drift` 从 1.05 秒到片尾缓慢位移并从 1 放大到 1.012。
- 署名：`name-placement → name-motion → person-name / person-role`。`name-motion` 的 X 轨道同时含入场和后续轻移，Y 轨道在 1.06 秒后缓慢移动。
- 引号：`quote-mark-placement → quote-mark-motion → quote-mark`。Y 轨道同时含入场和后续漂移，X 漂移从 1.10 秒开始。
- 卡片：`card-placement → card-motion → quote-card`。`card-motion` 在 2.55 秒后缓慢移动，组件内部的路径与展开进度另有轨道。

要减弱或停用漂移，调整后段关键帧相对起点的位移，或让后段数值保持不变；姓名的 X、引号的 Y 同时包含入场，不宜为了停用漂移删除整条轨道。

## 液态玻璃、透明人像与背景

卡片内部通过 `nativeGlassEffect` 创建 WebGL2 Surface，采样它背后的真实场景。其参数保存在 `quote-card.props.data`，该节点的 `effects` 数组为空；不要把这里的玻璃参数写到一个不存在的外部效果实例上。采样排除了卡片自身和之后的节点，调整图层顺序会改变玻璃看到的内容。

`src/native-glass.ts` 与 `src/native-glass-shaders.ts` 实现光学效果，来源和改造记录在 `src/glass-provenance.json`。参数含义如下：

- `thickness` 扩大边缘折射影响带，并加宽、柔化高光和反光带；它不改变卡片外形尺寸或圆角。
- `refraction` 控制折射强度，`blur` 控制透射画面的柔化，`dispersion` 控制边缘 RGB 采样偏移。原模板的色散为 8，可按需求修改。
- `rimIntensity`、`edgeReflection` 调整边缘高光与反光；`lightSweep`、`sweepProgress`、`sweepIntensity` 共同影响方向和扫光。`tintColor`、`tintOpacity`、`shadowOpacity` 分别控制着色与阴影。

发布工程中保存的是 `thickness: 47`、`refraction: 15`、`blur: 16.01`、`dispersion: 8`、`rimIntensity: 33.8`、`edgeReflection: 0.46`、`tintOpacity: 0`。它们与源码中新建组件的部分默认值不同；继续编辑时以当前工程里的值为起点，按用户要求改变相应参数。

人物占位素材 `portrait-placeholder` 是真实 Alpha 透明 PNG，轮廓内外透明，仅保留白色轮廓、问号和光晕。模板通过图片自身的 Alpha 合成，不依赖黑色背景或混合模式去黑；换入带不透明背景的图片时，该背景也会显示。需要只显示人物时，导入带 Alpha 的抠图素材。

底部渐隐效果定义 ID 为 `studio.portrait-quote.bottom-fade`，实例 ID 为 `portrait-feather`。`range` 与 `strength` 均为 0–100：前者决定从底部向上覆盖多少图片，100 可覆盖全图；后者决定渐隐强度，还会乘以效果 `mix`。`range: 0`、`strength: 0` 或关闭效果均可停止渐隐。它处理已有图片的透明度，不会去除图片背景。

背景图片叠在渐变之上；填写逻辑 `imageAssetId` 并开启 `imageEnabled` 即可显示。`imageOpacity` 使用 0–100，`imageScale` 使用倍率；`imageX/Y` 是相对居中位置的百分比点偏移，代码对应 `object-position: (50 + X)% (50 + Y)%`，不是画布像素坐标。图片关闭或透明时可见下方渐变。

## 改作示例与操作范围

- **“换人物，金句改成两行。”** 导入人物素材并更新 `portrait.props.assetId`，分别修改姓名、身份与 `quote-card.props.data.text`；在金句中加入换行符或设置 `wrapWidth`，保留 `autoSize: true`，按需要调整人物裁切和卡片位置。
- **“玻璃显得更厚，卡片上下多留一点空白。”** 分别调整 `thickness` 与 `paddingY`；前者改变材质边缘，后者通过自适应布局改变实际高度，保留现有 `expansion` 轨道即可。
- **“线条更快画完，展开后停留更久。”** 调整 `drawProgress`、`expansion` 的交接时间及后续文字/扫光时序，再按目标处理片尾、漂移和播放范围；保留用户未要求改变的曲线和材质值。

有活动编辑会话时，先读取当前工程和修订号，再使用当前 VMG CLI 提供的事务操作，避免用旧的磁盘副本覆盖现场编辑。实际命令和回执规则可查当前安装版本的 `vmg skill` 与 `vmg skill --reference transactions`。自定义组件数据应在当前值上修改目标字段；新增字段时使用支持组件数据更新的操作并保留其余字段。

需要改变布局算法、材质实现或标准面板时，再修改上述源码。工程使用 `react-v1`，SDK 仅提供类型，运行能力由 VMG 注入；保留其资源加载和基于 VMG 时间的动画方式。源码修改后的类型检查、构建、打包方法见 README 与解包后的 `AGENTS.md`。交付保留可编辑工程，按当前任务需要生成编译包或媒体文件。

本指南已对照 1.0.0 发布源码包的节点、标准绑定、字体声明、布局代码、着色器和轨道静态核对。本次仅补充指南与索引，未执行上述改作示例；模板原先的类型检查、构建、还原与编辑器运行记录见 README。后续操作按实际范围记录结果，不增加字数、风格、主观评分或视觉效果门槛。
