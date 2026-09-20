# 标准 VMG 工程

**当前尚未发布完整源码工程。** `catalog.json` 中的 `projects` 已预留，后续加入工程即可被同一套方向检索找到。

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

## 索引入口

下面仅说明将来如何记录，**不是已经存在的工程或可下载地址**：

```json
{
  "id": "vmg-liquid-glass-architecture",
  "title": "液态玻璃 · 软件架构说明",
  "kind": "vmg-project",
  "style_ids": ["S08", "S04"],
  "entry_path": "projects/vmg-liquid-glass-architecture/README.md",
  "source_path": "projects/vmg-liquid-glass-architecture/source/",
  "notes": "柔光科技塑造玻璃和空间观感，线性科技表达模块与连接关系。"
}
```

有真实工程时才把条目加入 `catalog.json.projects`。`source_path` 与 `package_url` 至少提供一种实际源码入口；预览地址、版本说明与其他资料可在条目或详细页补充。一个方向可对应多份工程，一个工程可关联多个方向。

此前的 VMG 液态玻璃架构图适合作为这个组合的工程候选。当前本库只记录其分类思路，不把未核验完整源码的编译预览发布为源码工程。
