# 恒大历史业务版图 · 可编辑源码

案例 1.0.0，VMG CLI / SDK 0.0.7，15 秒，1920×1080，30fps。

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
vmg doctor .
vmg dev .
```

标准面板可修改集团名称、英文、年份、页脚、产业说明、图片与字幕。镜头和各图层动画保存在 `project.vmg.json`，源码和标准面板定义在 `src/`。卡片与连接线共面，保持各卡片深度及水平旋转为 0 可延续这一布局；3D 摄影机仍可环绕整张图。

镜头采用自定义 CSS 3D 透视投影，VMG 提供编辑、求值、保存和渲染。透视后的画布选框与直接拖动尚未接入，请从标准面板或图层/属性面板编辑。

```sh
vmg pack . -o ../business-atlas-edited.vmg --assets include
vmg build . -o ../business-atlas-edited.vmgc --assets include
```

源码采用 Apache-2.0，许可副本在 `src/LICENSE-APACHE-2.0.txt`。照片及其渲染改编采用 CC BY-SA 4.0；字体许可在 `src/OFL-NotoSansSC.txt`；资料和素材署名同时保存在 `src/source-notes.ts` 与工程 metadata 中。

完整改作说明和预览：[awesome-vmg 案例页](https://github.com/VibeMG/awesome-vmg/tree/main/projects/evergrande-business-atlas)。
