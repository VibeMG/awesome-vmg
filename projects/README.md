# 标准 VMG 工程

**当前收录3个源码工程。** 其中2个为恢复源码包，1个为带标准模式的人物金句模板；各自的打开、渲染与还原记录见条目说明。

| 工程 | 定位 | 风格关联 | 配套 Skill |
| --- | --- | --- | --- |
| [原生AI工作流](native-ai-flow/README.md) | 液态玻璃架构演示 | S08柔光科技、S04线性科技 | [生成与改作指南](native-ai-flow/native-ai-flow_vmgskill.md) |
| [Duo展开2D](iphone-duo-unfold-2d/README.md) | 双屏设备特殊案例 | 不指定风格 | [生成与改作指南](iphone-duo-unfold-2d/iphone-duo-unfold-2d_vmgskill.md) |
| [人物金句](portrait-quote-glass/README.md) | 人物介绍、访谈摘句与观点展示 | S02深色商务、S08柔光科技 | [工程说明](portrait-quote-glass/README.md) |

恢复源码可修改实现和工程数据，但不等于原始TypeScript逐字还原。具体版本、素材许可和核验边界见各条目。

完整工程是参考库长期的核心内容：人可以打开继续编辑，Agent 可以同时理解画面、源码、图层和时间轴。标准化落在工程交付和说明方式上，不限定每个风格只能有一个模板。

## 交付内容

源码工程保留场景与时间轴数据、必要素材、依赖及锁文件，并说明打开方式与可编辑范围。沿用普通 VMG 源码项目或 `.vmg` 源码包；可附 `.vmgc` 或视频用于预览，但二者不能替代源码。

建议在 `projects/<project-id>/README.md` 说明：

- 工程适用的内容、关联方向和预览。
- 源码目录或 `.vmg` 包的位置，以及打开和改作方式。
- 制作时的 CLI/SDK 版本、依赖和素材信息。
- 授权、来源和需要使用者自行提供的资源。
- 若有多个版本，说明对应的源码与预览，避免把不同版本混用。

源码可放在 `projects/<project-id>/source/`，包也可通过本仓库 Releases 等入口分发。按具体工程体积选择，不增加后端、CLI 模板协议或安装时下载机制。

## 可选的模板 Skill

复杂工程可以在同目录附带 `<模板名>_vmgskill.md`，统一使用 `_vmgskill.md` 后缀，并通过 `catalog.json.projects[].skill_path` 提供相对于仓库根目录的路径。指南按所选工程读取，不需要安装到用户的全局 Skill 目录；只有源码包时仍能正常参考和改作。

指南记录适用模板/SDK 版本、关键节点与参数、实际联动关系，以及常见需求的修改示例。配套说明应对照同版本工程维护，说明实际验证范围。结构复杂时再链接必要的详细资料，不把所有工程说明一次性装入上下文。

模板 Skill 帮助 Agent 把需求落实到源码和工程数据，用户仍可改变布局、风格、内容与运动；不增加主观评分或作品淘汰条件。通用 `vmg-author` 负责 VMG 操作流程，模板指南补充具体实现知识，遵循当前用户要求与已有操作权限。

## 索引入口

`catalog.json.projects`使用稳定ID和`kind: vmg-project`。`source_path`（本地源码目录）、`package_path`（本地`.vmg`源码包）或`package_url`（外部源码包）至少提供一个实际入口。`preview_path`可指向包内附带的静态预览，`package_sha256`记录本地源码包校验值。

`style_ids`可以包含多个方向，也可以为空；特殊用途案例仍通过工程列表检索，不为满足分类而强加风格。默认风格倾向不影响案例收录。

本地源码包保持上传字节不变，通过VMG CLI解包；不要把`.vmgc`当成源码。执行`node scripts/check-catalog.mjs`检查目录结构，再用`python3 scripts/check-project-packages.py`检查源码归档及素材完整性。两者均不运行工程源码，也不代表视觉和运行验收。
