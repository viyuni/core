<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->

<!--CADS START-->

# 🛰️ Context-Aware Documentation System (CADS)

## 1. 智能触发与感知 (Smart Triggering)

当发生以下场景时，AI 必须自动启动 CADS 检索流程，严禁凭空猜测：

- **故障排查**: 终端出现编译错误或运行时异常。
- **功能实现**: 用户询问如何使用特定的组件、类名或 API。
- **知识同步**: 发现代码现状与预训练模型知识存在版本差异。

## 2. 混合依赖映射表 (Hybrid Dependency Mapping)

需实时比对 `package.json`，根据命中关键字直接锁定检索源（无需二次跳转）。

| 技术栈 (Tech Stack) | 检索源 (Local Path or Remote URL)                                   | 类型 | 核心依赖 (Context)      |
| :------------------ | :------------------------------------------------------------------ | :--- | :---------------------- |
| `nitro`, `server`   | `https://raw.githubusercontent.com/unjs/nitro/main/docs/1.index.md` | 远程 | `nitro`                 |
| `daisyui`, `ui`     | `.docs\daisyui\packages\docs\src\routes\(routes)\docs`              | 本地 | `daisyui`               |
| `elysia`, `bun`     | `.docs\elysia\docs`                                                 | 本地 | `elysia`                |
| `lucide`, `icon`    | `.docs\lucide\docs`                                                 | 本地 | `lucide`, `@lucide/vue` |

## 3. 动态检索指令 (Windows Optimized Execution)

确定路径后，必须严格执行以下带引号包裹的指令：

### A. 本地路径检索 (CMD/PowerShell)

- **标准格式**: `findstr /s /n /i /c:"关键字" "目标路径\*.md"`
- **避坑指南**:
  1. 必须对整个路径加双引号：`"docs\my path\*.md"`。
  2. 若关键字包含空格，必须使用 `/c:"key word"` 模式。
  3. 在 PowerShell 中，建议配合 `Select-String` 作为备选：
     `Get-ChildItem -Path "目标路径\*" -Include *.md,*.svelte -Recurse | Select-String "关键字"`

### B. 远程 URL 检索

直接读取远程 Raw 内容。若内容过大，仅采样关键字所在段落。

## 4. 深度处理协议 (Processing)

1. **区块锁定**: 优先提取 `` 标记内容。
2. **环境对齐**: 对比 `package.json`，依赖缺失时必须提示安装。
3. **输出溯源**: 回复结尾强制包含 `Ref: [Source] (Line: [No.])`。

## 5. 健壮性约束 (Robustness)

- **拒绝幻觉**: 若 `findstr` 命中数为 0，报告“知识库未涵盖”，并提供 `npm run docs:pull` 建议。
- **路径转义**: 识别到路径中包含 `(` 或 `)` 时，AI 必须确保在 shell 执行时路径已被双引号完全包裹。
<!--CADS END-->
