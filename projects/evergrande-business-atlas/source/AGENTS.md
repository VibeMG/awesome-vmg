# VMG authoring contract

Keep this a standard Node/TypeScript/React project. Import SDK symbols with import type; the SDK has no runtime implementation. Use the installed React entry points and relative source imports. The current react-v1 Builder does not accept other runtime npm packages, Node builtins, user Vite/PostCSS plugins, or CSS preprocessors.

vmg.config.ts is a pure data export satisfying VmgBuildConfig. Keep every authored file under its sourceRoots; pack preserves unused and unfinished source, while build performs strict checking. Export an explicit components array. Each source component declares an id/version, editable metadata and explicit defaultData; render can use normal React/Hooks.

Animation frames depend on VMG time, current project data and declared resources. Wall clock, unfixed randomness and unpersisted component heap state are not saved/exported animation state. Do not import project.vmg.json or raw media into source code. Project assets select stable resourceId versions; physical original/preview locations belong only in .vmg/resources.json. New content needs a new version identity.

Use vmg doctor ., vmg dev ., pnpm run typecheck, vmg pack . -o ../project.vmg --assets include and vmg build . -o ../project.vmgc --assets include. Never add Editor/Core/Renderer implementation dependencies to this project. The dev editor uses fixed host builds; do not add user Vite configuration or start package scripts for it. Source failures keep the last valid preview; external document conflicts require repair or explicit resolution. Read vmg skill and vmg skill --reference transactions for the current Agent interface and receipt rules. Use documented installed Renderer commands or the editor for video export.
