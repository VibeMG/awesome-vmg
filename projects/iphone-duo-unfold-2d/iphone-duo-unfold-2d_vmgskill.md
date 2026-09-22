---
name: iphone-duo-unfold-2d-vmg
description: 基于 Duo 展开 2D 工程生成或改作双屏设备动画，处理内外屏素材、锁屏内容、展开节奏及屏幕投影之间的联动。
metadata:
  template-id: com.vmg.templates.iphone-duo-unfold-2d
  template-version: "1.5.0"
  sdk-version: "0.0.6"
---

# Duo 展开 2D 模板 Skill

用于选中本工程后制作壁纸、应用界面或双屏设备展示。展示内容、配色、构图与节奏按用户需求调整，不要求作品归入某个风格。

本指南对应 [README](README.md) 中校验值标识的 `iphone-duo-unfold-2d.vmg`：模板 `1.5.0`、SDK `0.0.6`，原始画布 1280×960、30 fps、8 秒。下载、解包和许可见 README；不要将其他版本的预览或参数直接套用到此包。以下路径均相对于解包后的工程目录。

## 工程结构与修改入口

`project.vmg.json` 保存实例参数、素材和轨道。`src/components.tsx` 声明设备外框、壁纸、按钮等组件；`src/effects.ts` 声明屏幕投影和玻璃文字；`src/entry.tsx` 声明标准面板及字体；实际回调在 `src/recovered/implementation.js`。已有实例应修改工程数据，改源码 `defaultData` 不会替换已有实例参数。

| 需求 | 修改位置 |
| --- | --- |
| 整体位置与缩放 | 根组 `duo-phone.transform`。内外屏内容、外框均在其下。 |
| 展开状态与机身亮度 | `duo-frame.props.data.progress`（0 为闭合、1 为展开）、`props.data.brightness`；已有展开轨道会覆盖静态进度。 |
| 内屏 / 外屏内容 | `duo-display` / `duo-outer-display` 两个组，各自包含壁纸、文字和快捷按钮，并附屏幕投影效果。 |
| 壁纸与构图 | `duo-screen` / `duo-outer-screen` 的 `props.data.screenAssetId`、`contentScale`、`offsetX`、`offsetY`、`zoomStart`、`zoomEnd`、`zoomProgress`。 |
| 时间与日期 | `duo-clock` / `duo-outer-clock`、`duo-date` / `duo-outer-date` 的 `props.text` 及文字外观。标准面板的 `time-text`、`date-text` 同时绑定内外屏。 |
| 快捷按钮 | `duo-flashlight`、`duo-camera` 及 `duo-outer-*` 对应节点的 `props.data.visible`、`color`、`size`、`right`、`bottom` 等。 |
| 屏幕边缘与反光 | 壁纸节点的 `props.data.reflection`、`blur`、`shadow`、`distortion`，以及屏幕组投影效果中对应的动画进程。 |

## 共用或分别设置壁纸

通过现有素材导入/替换流程得到逻辑 asset ID，再写入 `screenAssetId`，不要把文件路径直接写成 asset ID。

- **共用一张：** 将 `duo-outer-screen.props.data.mediaMode` 设为 `shared`，更新该外屏节点的 `screenAssetId`。内屏通过 `sharedScreenId: duo-outer-screen` 读取外屏选择的素材；只修改内屏的 `screenAssetId` 不会改变此模式下显示的图片。
- **内外屏分别设置：** 将外屏的 `mediaMode` 设为 `separate`，分别更新 `duo-screen` 与 `duo-outer-screen` 的 `screenAssetId`。即使两者起初引用同一资源，后续也能分别选择。
- 两个屏幕可以分别设置构图与缩放参数。`zoomStart` / `zoomEnd` 是倍率端点，`zoomProgress` 有自己的动画轨道；它们与机身展开进度是不同的属性。

想要相同时间、日期或按钮设置时，可使用标准面板的关联绑定；直接改工程数据时，应同步处理相应的两个节点。用户要求内外屏内容不同时，可以分别修改，并按需调整标准面板的 `linkedBindings`，避免后续面板操作再次覆盖差异。

## 调整展开节奏

原工程的机身主轨道是 `duo-frame` 的 `props.data.progress`，从 0.8 秒的 0 到 6.2 秒的 1。内屏壁纸缩放也跨越这个区间，外屏壁纸缩放在 3.608 秒结束。屏幕模糊、压暗和扭曲另有轨道；单改机身两个关键帧不会同步改变这些动画。

编辑器已有“整体展开节奏”扩展。其实现对 `duo-phone` 及后代节点的所有轨道统一改时；Agent 可参考该逻辑，使用当前 CLI 实际提供的事务/轨道操作，不假定存在同名 CLI 命令。

把旧展开区间 `[a, b]` 改为 `[c, d]` 时，该实现对相关关键帧时间 `t` 采用以下映射：

- `t < a`：`t × c / a`，调整展开前的部分；合法时间中 `a = 0` 时不会进入此分支。
- `a ≤ t ≤ b`：`c + (t - a) / (b - a) × (d - c)`。
- `t > b`：`t + d - b`，平移展开后的部分。

保持关键帧的值、缓动和分组关系，同时处理轨道的 `loop.start/end`（若存在）。确保区间合法，按用户的目标时长调整 `duration` 与 `playback.start/end`；现有扩展会扩展 `duration`，不会自动缩短它或更新播放范围。需要独立设计某层动作时，仅修改该层相关轨道。

例如把展开过程从 0.8–6.2 秒改成 1–4 秒，可按上述映射同时处理机身、两块壁纸和屏幕效果，保留各轨道之间原有的相对时序；片尾停留时间另按需求设置。

## 保持屏幕与内容关联

- 外框和遮罩使用逻辑素材 `duo-phone-frames`。它是设备几何资源，不是可替换壁纸；保留其资源绑定。若要换设备造型，需要处理对应几何和实现，不能仅替换一张屏幕图片。
- `duo-display` 的效果实例是 `duo-projection`，外屏对应 `duo-outer-projection`；属性路径形如 `effects.@duo-projection.params.blurAmount`。原始 JSON 的 `effects` 是数组，`@...` 表示按实例 ID 选取。
- 投影效果中的 `controllerId`、`screenId`、`surface` 分别关联展开控制、壁纸与内外屏；屏幕组内的文字和按钮继承投影。新增屏幕内容应进入相应组，重命名节点时同步维护这些引用。
- 原工程 `motionTracks: true`，模糊等效果进程从关键帧读取。屏幕组 `metadata.duoAlignmentMode: follow` 表示随设备几何对齐。手动对齐的入口在“屏幕对齐与精修”扩展；单改 `contentShiftX` 可能仍被跟随模式覆盖。需要独立偏移可先查看 `contentOffsetX` 的实际用途，切换手动模式则同时考虑已有对齐轨道。
- 快捷按钮还通过 `batchId` 和合成节点的 `buttonIds` 关联。新增或重命名按钮时同步修改合成列表、`controllerId`、`screenId` 与 `surface`，避免只改一个可见节点。
- 时钟字体由 `src/entry.tsx` 的 `fonts` 关联到字体 asset ID。更换字体时同步字体声明与文本的 `fontFamily`，并保留实际字体资源。

## 改作示例

- **“外屏展示品牌海报，展开后显示应用界面。”** 选择 `separate` 模式，分别导入两张图片并绑定，再按各自内容调整缩放与偏移。锁屏文字和快捷按钮可按用户要求修改或隐藏。
- **“只展示我的壁纸，快速展开后停留。”** 选择 `shared` 模式替换外屏绑定的素材，统一调整展开区间，再安排展开后的停留时间；如需隐藏时钟与日期，修改两个屏幕对应文字节点的 `transform.visible`。

在解包副本上按现有 VMG 流程操作；有活动编辑会话时采用通用 `vmg-author` 的事务方式。保存可编辑 `.vmg`，需要编译预览时再构建 `.vmgc`。本指南已对照收录包的静态源码与数据核对，尚未证明这些改作已在浏览器运行或通过视觉验收；实际执行后如实记录验证范围。
