---
name: evergrande-business-atlas-vmg
description: 基于恒大历史业务版图案例生成或改作企业架构、组织关系与产品矩阵动画，定位共面卡片、跟随连线、3D 摄影机、字幕和时间轴的修改入口。
metadata:
  project-id: evergrande-business-atlas
  project-version: "1.0.0"
  cli-version: "0.0.7"
  sdk-version: "0.0.7"
---

# 企业业务版图 · 共面架构与 3D 镜头 Skill

用于选中本案例后替换企业内容、调整结构和镜头，继续交付可编辑 VMG 工程。原作采用 S02 深色商务＋S04 线性科技；3D 镜头巡游是运动方式，共面图文卡片构成 2.5D 信息图。用户可以改变内容、配色、布局、卡片数量和运动，不必保持八个平台或 15 秒。

本指南对应案例 `1.0.0`，CLI / SDK 均为 `0.0.7`，原始画布为 1920×1080、30 fps、15 秒。下载、打开与打包命令见 [README](README.md)。以下工程路径均相对于 [source/](source/)；使用其他版本时以实际源码和工程数据为准。

## 实现与编辑入口

`camera-3d` 使用自定义组件 `studio.evergrande.camera`，在 `src/index.tsx` 的 `ArchitectureScene` 中统一绘制场景。卡片、连线、字幕分别使用 `studio.evergrande.card`、`.link`、`.caption`；这三个组件自身的 `render` 返回 `null`，实际画面由摄影机读取其数据生成。四个组件版本均为 `1.0.0`。

VMG 提供文档、素材与字体、属性编辑、保存、轨道求值和渲染；摄影机透视由本项目的 CSS 3D 变换与 `projectPoint` 实现。卡片虽是独立数据图层，但透视后的画布选框和直接拖动尚未接入，应通过标准面板或图层/属性面板编辑。删除或隐藏 `camera-3d` 会使整套合成场景消失。

| 需求 | 位置与参数 |
| --- | --- |
| 集团主卡 | 节点 `group` 的 `props.data.title`、`english`、`detail`、`logo`、`image`、`yearLabel`、`yearCaption`。`group` 是卡片 ID，不是容器组；`logo: ""` 会隐藏标志并让标题左移。 |
| 页眉、口径与页脚 | `camera-3d.props.data.heading`、`period`、`note`、`footerBrand`、`footerYear`。这些字段与主卡文字分别保存。 |
| 八个平台 | `estate`、`property`、`auto`、`tourism`、`network`、`fcb`、`health`、`water` 的 `props.data`：`title`、`english`、`detail`、`badge`、`number`、`image`、`color`、`colorEnd`、`light`。 |
| 细分业务 | `residential-business`、`investment-business`、`community`、`hengchi-brand`、`theme-parks`，采用同一卡片组件，`props.data.kind` 为 `leaf`。 |
| 卡片位置与尺寸 | 卡片的 `transform.x/y/width/height/scaleX/scaleY/rotation/opacity/visible`；合成器将 `x/y` 作为卡片中心，当前节点锚点为 0.5。 |
| 摄影机 | `camera-3d.props.data.cameraX`、`cameraY`、`distance`、`yaw`、`pitch`、`roll`、`focal`。 |
| 连线 | `edge-*` 的 `props.data.from`、`to`、`route`、`lane`、`progress`、`color`、`thickness`、`brightness`。 |
| 解说字幕 | `caption-1` 至 `caption-7` 的 `props.data.text/kicker/color`，位置、宽度和显隐使用该节点的 `transform.x/y/width/opacity`。 |
| 版式与材质 | `src/scene.css`；组件绘制逻辑在 `src/index.tsx` 的 `CardFace`、`ArchitectureScene`。 |
| 标准编辑面板 | `src/standard.ts` 的分组、`binding.nodeId/propertyPath` 和 `proTargets`。 |

当前实例值及轨道保存在 `project.vmg.json`，修改 `defaultData` 不会更新已有实例。仅替换内容或调整已支持的参数时，优先修改工程数据；改变排版、投影或标准面板时再改源码。

有活动编辑会话时先读取当前工程和修订号，通过当前 CLI 的 Agent 事务修改并保存，避免旧磁盘副本覆盖现场编辑。具体操作与回执查 `vmg skill` 和 `vmg skill --reference transactions`；更新组件数据时保留未涉及的字段。

## 共面卡片与连线

当前 14 张卡片均为 `props.data.depth: 0`、`tilt: 0`，没有卡片深度轨道。保留原有共面效果时，让卡片继续共享这两个值，通过摄影机运动产生空间感。若用户要求分层空间，再调整卡片深度与连接方式，不把共面当作所有改作的限制。

连线根据 `from/to` 引用卡片 ID，`cardAnchor` 从卡片尺寸、缩放、旋转和深度计算端点，`projectPoint` 使用与卡片相同的摄影机投影。改变显示名称无需改 ID；移动卡片后端点会跟随。这里没有独立的原生 path 节点，线条生长由 `props.data.progress` 控制。

| 路由 | 实际行为 |
| --- | --- |
| `direct`，两端 X 对齐 | 从起点卡片底部到终点卡片顶部画一个直线段，此时 `lane` 不参与计算。 |
| `direct`，两端 X 不同 | 起点底部 → `lane` 指定的 Y → 终点 X → 终点顶部，转折处保持起点卡片的深度。 |
| `outside` | 从起点右边缘绕行，外侧竖线的 X 在 `pathPoints` 中写为 `1630`，再经 `lane` 接入终点；只改 `lane` 不会移动这条外侧竖线。 |

`lane` 是场景坐标中的转折 Y，不是屏幕上的像素位置。原作平台上排使用 `-300`，下排外绕使用 `425`，细分业务使用 `142`。改布局时按新的卡片边界安排通道；如果画面整体倾斜，应调整摄影机角度，而不是用额外拐点补偿透视。

`collectCards` 会累计卡片父组的位置、缩放、旋转、透明度和可见性；`platforms` 与 `details` 分别包含平台和细分卡片。连线位置来自卡片端点，但其透明度读取连线自身与目标卡片；字幕使用自身屏幕坐标。当前实现没有给 `connections`、`captions` 组应用同样的父变换累计逻辑，移动或隐藏这些容器组不等同于操作其中每个元素。

## 摄影机、显隐与时间轴

`cameraX/Y` 指定场景目标位置，`distance` 控制观看距离，`focal` 控制透视焦距，`yaw/pitch/roll` 分别为水平环绕、俯仰和滚转角，单位为度。以目标居中且其他参数相同为例，增大 `distance` 会拉远，增大 `focal` 会放大。`camera-3d.transform.x/y` 移动的是整张合成画面，不是摄影机目标位置。

全片正面观看时，令 `yaw/pitch/roll` 为 0，并同步处理这三项已有轨道；仅改静态值会被播放中的关键帧覆盖。卡片各自的 `tilt` 或 `transform.rotation` 仍会影响自身方向。

轨道位于 `project.vmg.json.tracks`，通过 `nodeId` 与 `propertyPath` 指向属性；关键帧使用秒数 `time`、`value`、`easing`，相关关键帧可有共同的 `groupId`。本版本共有 46 条轨道，包括六项摄影机参数、卡片透明度和照明、连线生长、字幕透明度，以及摄影机节点自身 X/Y 的两条小幅位置轨道。继续改作时以当前保存值为准。

连线最终透明度还会乘以目标卡片透明度：目标卡片未出现时，即使 `progress` 已增长也可能看不到线。字幕透明度同时驱动其轻微纵向入场。调整一段讲解节奏时，一起定位对应卡片显隐、连线 `progress`、字幕显隐与摄影机关键帧。

延长时长时同步处理 `duration`、`playback.start/end` 和需要移动的关键帧；仅延长片尾停留不必重排所有入场。底部进度线由 `time / project.duration` 计算，会随工程时长更新。保留基于 VMG 时间的求值，不用墙上时钟或未保存的组件状态驱动动画。

## 增删业务与更换企业

新增业务可复制同类卡片节点，保留完整组件数据并赋予新的节点 ID、名称、`parentId` 和位置，再添加引用它的连线。复制入场轨道时同步更新 `nodeId`、轨道 ID、关键帧 ID 和相关分组标识；新增节点不会自动获得动画。当前标准面板列出集团与八个平台以及七段字幕，细分业务和新节点需要通过图层属性编辑，或在 `src/standard.ts` 中补充入口。

删除节点时同步移除引用它的连线、轨道和面板绑定；调整讲解内容时再处理对应字幕与镜头。重命名节点 ID 也需要更新 `parentId`、`from/to`、轨道和面板引用。只增加已有类型的实例可沿用四个现有组件；确需新组件类型时，再维护组件注册与工程的 `componentRequirements`。

更换企业时，主卡、页眉页脚、产业与细分卡片、字幕、素材署名和资料口径分别更新。`src/standard.ts` 的标题与分组标签也含“恒大”等示例名称。画面中固定的 `BUSINESS ATLAS`、“历史业务版图”和 `/ BUSINESS` 在 `src/index.tsx`，需要不同用途文案时修改这些绘制位置。

原作内容采用恒大 2020 年报的历史业务口径，连线表达业务关联。保留该示例时沿用 [SOURCES.md](SOURCES.md) 的出处和注记；换公司或资料时期时使用对应资料，不把示例的八平台、49% 持股注记或历史年份带入新内容。新素材来源和许可应随工程保留；公开改版涉及出处变化时，同步维护案例来源说明、`src/source-notes.ts` 和工程 `metadata.sourceNotes`。

## 字体、图片与外观

`image/logo` 使用项目逻辑素材 ID，由 `assetUrl` 加载。导入与替换图片走 VMG 资源流程，保持工程引用和 `.vmg/resources.json` 的资源版本一致，不把作者磁盘路径写进组件数据。清空图片字段可移除对应图片；`credit` 保存署名信息，但当前卡片绘制不会将它直接显示为画面文字。

`font-noto` 对应 Noto Sans SC，在 `src/index.tsx` 的 `fonts` 中声明并通过 `--vmg-font-noto` 使用。更换字体时同步处理资源与声明。场景注册了图片帧准备流程 `runtime.frames.useParticipant` / `runtime.scene.prepareImage`，修改图片加载时保留这条渲染准备路径。

普通业务卡渐变读取 `color/colorEnd`；主卡 `.eg-root` 和细分卡 `.eg-leaf` 的渐变在 CSS 中另行指定。根卡、业务卡、细分卡、字幕的字号与排版也在 CSS 中，不能通过不存在的原生文本节点参数修改。标题和部分说明当前为不换行布局，用户需要更长文字或多行排版时，可按需求调整卡片尺寸、字号或换行规则。

`kind` 选择 `root/business/leaf` 分支，`icon` 对应 `Icon` 中的 `estate/property/car/tourism/film/trade/health/water` 图形，未知名称回退到地产图标。新增图标需补充对应矢量路径。这些值与连线 `route` 已存在于数据中，但没有列入当前组件的可编辑字段面板；需要面板操作时同步增加 `editable` 声明。

## 改作示例与验证范围

- **“换成我们的集团，保留镜头风格。”** 更新主卡与页眉页脚，替换业务、字幕和素材，按实际结构增删节点；保留共面布局作为起点，再把摄影机目标与显隐时序对应到新内容。
- **“在汽车下面加一个研发分支。”** 复制 `leaf` 卡片并设置新 ID 和位置，增加 `from: "auto"`、`to: 新卡片 ID` 的连接线，按新位置选择 `lane`，补上所需显隐与线条生长轨道；需要标准面板入口时同步添加绑定。
- **“连线保持笔直，全程正面缓慢推进，结尾多停两秒。”** 保持卡片共面，处理摄影机三项角度轨道，用 `cameraX/Y/distance` 控制观看范围，延长工程与播放终点并保持片尾关键帧值；沿用现有直线和分支路由即可。

本指南对照 1.0.0 源码、节点、轨道和标准面板静态核对。本次只补充 Skill 与索引，未执行上述新增分支或改时长示例。原案例的编辑保存、PNG 渲染、类型检查、打包、构建和解包记录见 [verification.json](verification.json) 及 README。改作后的检查按实际变更记录基础可运行情况，不设置主观评分、字数或风格门槛；交付保留可编辑工程，媒体导出按用户要求执行。
