# 下游:如何跟进 KunUI 更新与升级

给使用 `@kungal/ui-*` 的项目(尤其**还停在旧版本如 0.5.2** 的)。把本文贴进你的 repo,或转给维护者即可。

KunUI 的四个包 **`@kungal/ui-tokens` / `ui-core` / `ui-vue` / `ui-nuxt` 锁步同版本**,务必一起升。

---

## 1. 在哪看「改了什么」(三处任选,均自动更新)

| 渠道 | 链接 | 适合 |
|---|---|---|
| 🌐 在线更新日志 | **<https://ui.kungal.com/changelog>** | 浏览全部版本变更,带 Major/Minor/Patch 标签 |
| 📦 npm 包页面 | `npmjs.com/package/@kungal/ui-vue?activeTab=code` → `CHANGELOG.md` | 看你正要升到的那个版本 |
| 🏷 GitHub Releases | **<https://github.com/kungal/kun-ui/releases>** | 点 **Watch → Custom → Releases** 即可在有新版时收到通知 |

> 你装的旧包(如 0.5.2)本地**不含** CHANGELOG —— 去上面任一处看即可。

## 2. 让更新「自己找上门」(推荐:Renovate)

在你的 repo 加 `renovate.json`,KunUI 有新版时会**自动开 PR**,并把上面的 Release notes / CHANGELOG **内联显示在 PR 里**:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "description": "KunUI 四包锁步同版本 —— 合到一个 PR 一起升",
      "matchPackageNames": ["/^@kungal/ui-/"],
      "groupName": "KunUI"
    }
  ]
}
```

（Dependabot 亦可,但它不会把四个包合成一个 PR,需要你手动保证四包同版本。)

## 3. 怎么升

```bash
pnpm up "@kungal/*@latest"     # 一起升到最新(四包同版本)
```

- **从 1.x 升 1.x**:几乎「装上就好」(SemVer,无破坏性变更)。值得过一眼的少数视觉/行为变化见 [`UPGRADE-1.x.md`](./UPGRADE-1.x.md)。
- **从 0.5.2 或更早升 1.x**:这是**破坏性大跨度**,先按 [`UPGRADE-0.5.2-to-1.0.0.md`](./UPGRADE-0.5.2-to-1.0.0.md) 迁移,再看 `UPGRADE-1.x.md`。
- 升级后跑一遍构建 + 用到的页面,重点回归 `UPGRADE-1.x.md` 列出的几处。

## 4. 一句话

> 跟进 KunUI = **Watch 仓库的 Releases**(或配 Renovate)+ 升级前扫一眼 [更新日志](https://ui.kungal.com/changelog)。维护者无需再手写或转发升级说明。
