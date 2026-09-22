---
name: native-ai-flow-vmg
description: 基于原生 AI 工作流工程生成或改作液态玻璃架构动画，定位模块、连线、玻璃材质、编辑面板和时间轴的修改位置。
metadata:
  template-id: com.vmg.native-ai-flow
  template-version: "1.8.0"
  sdk-version: "0.0.6"
---

# 原生 AI 工作流模板 Skill

用于选中本工程后，把用户提供的系统架构、业务流程或模块关系做成可编辑动画。沿用用户的内容、风格和运动要求；模块数量、布局、配色和时长都可以调整。

本指南对应 [README](README.md) 中校验值标识的 `native-ai-flow.vmg`：模板 `1.8.0`、SDK `0.0.6`，原始画布 1600×1200、30 fps、9 秒。下载、解包和许可见 README。使用其他版本时，重新读取实际节点、参数和契约。以下路径均相对于解包后的工程目录。

## 从哪里修改

这是原生 `group`、`shape`、`text`、`path` 和 `media` 节点组成的场景，`src/components.tsx` 的组件列表为空。内容与运动主要在 `project.vmg.json`；无需为了换文案重写一个整屏 React 组件。

| 需求 | 修改位置 |
| --- | --- |
| 模块名称与说明 | `agent-name`；`sdk-name` / `sdk-caption` / `sdk-microdetail`，以及 `cli`、`web` 的同类文本节点；`editor`、`core`、`renderer`、`builder` 的 `-name` / `-caption` 节点。可见文案在 `props.text`，图层列表名称在节点 `name`。 |
| 分区与文件层文字 | `browser-zone-label`、`builder-zone-label`、`format-label`、`source-format`、`compiled-format` 的 `props.text`。 |
| 背景与遮光 | `paper.props.assetId` 指向背景素材；`wallpaper-shade.transform.opacity` 控制遮光。通过现有素材导入/替换流程取得逻辑 asset ID。 |
| 卡片与分区玻璃 | 相应节点的效果实例 `liquid-glass`；属性路径形如 `effects.@liquid-glass.params.blur`、`refraction`、`rimIntensity`、`tintColor`、`tintOpacity`。 |
| 移动、缩放或改画布 | 节点 `transform` 及其已有轨道；整体架构在 `diagram` 下，顶部产品卡片在 `products` 下。背景 `paper` 和遮光层独立于 `diagram`。 |
| 连线、箭头与流动信号 | `path` 节点的 `props.d`，以及信号节点的 `pathFollow.pathNodeId`、`pathFollow.progress` 和相关轨道。 |
| 标准面板与源码行为 | `src/entry.tsx` 的 `standardSchema`；`src/effects.ts` 的效果声明；`src/editor-contributions.ts` 的编辑面板声明。实际回调在 `src/recovered/implementation.js`。 |

这里的属性路径用于 VMG 的属性操作；原始 JSON 中的 `effects` 是数组，`@liquid-glass` 表示按实例 ID 选取，不能写成 JSON 对象键。效果定义 ID 为 `com.vmg.native-ai-flow.liquid-glass`，与实例 ID 不同。

## 把新内容放进工程

先从用户内容中确定模块、分区和关系，再映射到现有卡片或增删节点。仅改名称时保留节点 ID，修改文本即可；ID 不需要跟着文案一起变化。不要把原有 SDK、CLI 等关系直接当成用户系统的业务关系。

标准面板中的 `binding` 和 `linkedBindings` 描述批量修改范围。例如 `glass-blur` 覆盖 Agent 和七张模块卡片；`glass-tint-opacity` 与 `glass-tint-color` 不覆盖 Core，Core 着色浓度有独立控件。分区玻璃由 `zone-*` 控件管理。直接修改某个节点不会自动执行面板的其他绑定；需要整体调整时，按实际绑定范围批量修改。

仅改变文案、位置、材质和动作时，修改工程数据即可。需要扩充标准面板、改变效果实现或编辑交互时，再修改对应源码。已有实例的参数保存在工程数据里，修改效果声明的默认值不会替换这些值。

## 增删模块与重排布局

- 可以复制尺寸与用途接近的卡片及其子节点，再分配新节点 ID；同步重定向 `parentId`，使文字和图标随卡片运动。实际层级以 `parentId` 为准。
- `metadata.nativeFlowProOwners` 是编辑器的逻辑归组映射，不是变换层级。新增卡片与细节时可按现有映射登记；`metadata.defaultTimelineNodeIds` 决定默认展示的时间轴对象。维护这些信息能让改作后的工程继续便于编辑。
- 若继承旧动作，复制相关轨道并更新 `nodeId`、轨道 ID、关键帧 ID 和姿态分组 `groupId`，保持同一姿态的分组关系。若设计新动作，使用新节点自己的轨道。删除模块时清理其后代及相关轨道和引用。
- 连线不是根据卡片名称自动生成的约束。`agent-link`、`cli-browser-link`、`host-builder-link` 等保存 SVG 路径；调整卡片布局后，同步修改路径端点和独立箭头。`sdk-contract` 的虚线也是由多段路径组成。
- 信号 `agent-signal` 跟随 `agent-link`；`runtime-signal` 和 `runtime-signal-final` 跟随 `cli-browser-link`；`builder-signal` 跟随 `host-builder-link`。更换或删除路径时，处理这些跟随关系。
- 更名或移除面板引用的节点时，同步维护 `src/entry.tsx` 中的 `binding` / `linkedBindings`。新增可编辑内容可仿照已有文本控件增加入口，控件标签也应反映新的用途。

改变画布比例时可先调整 `diagram` 的整体变换，再按新构图重排；背景与遮光层的尺寸需单独适配。具体布局由用户需求决定。

## 时间轴与玻璃动作

现有轨道覆盖位移、缩放、透明度、线条 `props.trimEnd`、信号 `pathFollow.progress` 以及玻璃 `sweepProgress` / `sweepIntensity`。改变一个已有动画的属性时，先读取对应轨道；只改节点静态值可能在播放时被关键帧覆盖。

整段改变时长时，同步考虑相关关键帧时间、`duration`、`playback.start/end` 和 `metadata.chapters`；只改某个模块的节奏时，定位该模块及关联连线、信号的轨道。原来的 9 秒和章节安排是参考，可重新编排。

玻璃效果通过 WebGL2 采样背后的画面，背景、图层顺序和透明形状共同影响结果。调参可从现有 `blur`、`refraction`、着色和高光入手；参数单位以 `src/effects.ts` 声明为准。只有需要不同的光学行为时才修改恢复实现中的效果回调。

## 改作示例

- **“改成数据采集、处理、分析三层架构。”** 先按用户实际关系组织分区和模块，替换对应 `-name` / `-caption` 文案；再调整连线、分区标签和面板标签。有更多模块时按上述引用关系扩充节点，不受原来卡片数量限制。
- **“增加一个存储模块，跟 Core 相连。”** 可从合适的模块卡片复制出新卡片和文本，配置新 ID 与父层级，增加连线并安排其轨道，再补齐逻辑归组和需要的标准面板控件。

在解包副本上按现有 VMG 流程操作；有活动编辑会话时采用通用 `vmg-author` 的事务方式。保存可编辑 `.vmg`，需要编译预览时再构建 `.vmgc`。工程代码来自恢复源码，修改其实际实现即可，无需先还原原始 TypeScript 模块组织。

本指南中的节点、绑定和轨道说明已对照收录包的静态源码与数据核对；这不表示上述改作已完成浏览器运行或视觉验收。实际执行后如实记录验证范围。
