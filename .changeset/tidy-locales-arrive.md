---
'@kungal/ui-vue': minor
---

KunUI's own strings are now a locale, not literals baked into the components.

Until now the text KunUI renders by itself was hardcoded Chinese in 25 components — 67 sites a consumer could not reach at all. Three of them were reported from the Flutter port (`移除` on KunChip's ×, `清除` / `显示密码` / `隐藏密码` on KunInput), but the surface is much larger: the whole KunLightbox toolbar, all of KunPagination, KunCommandPalette's footer hints, KunCarousel's and KunTagInput's per-item labels. Most are accessible names for icon-only controls, so a non-Chinese app shipped a screen reader announcing a language its users do not read, with no prop, no slot, and no override to fix it. KunDatePicker had drifted the other way and announced `Clear date` / `Previous year` in English while its visible buttons said 今天 / 清空 / 关闭.

All of it now resolves through one `KunLocale` on the existing KunUI config, alongside `rounded` and `linkComponent`, with the same precedence the config already documents:

```
per-instance prop  >  KunUIConfig locale  >  built-in default
```

```ts
import { installKunUIConfig } from '@kungal/ui-vue'
import en from '@kungal/ui-vue/locale/en'

installKunUIConfig(app, { locale: en })
```

`zh-CN` stays the built-in default and every one of its strings is reproduced verbatim, so **an app that does nothing renders byte-identical output**. The 20 props that already overrode one of these strings (`noResultText`, `copiedText`, `triggerText`, …) keep working and still win over the locale; their defaults simply moved into the locale, which the docs PropsTable now names instead of a Chinese literal.

Other locales are separate entry points, not named exports of the barrel, so a zh-CN consumer never downloads English: `dist/locale/en.js` is 3 kB and is only pulled in if imported. Write your own with `defineKunLocale` — it type-checks against `KunMessages`, so a missing key is a compile error rather than a `{placeholder}` leaking into an `aria-label`.

Interpolated strings are single templates (`'第 {page} 页'`, `'Go to slide {index}'`) rather than fragments concatenated at the call site, because a placeholder's position is not stable across languages — react-aria ships `Decrease {fieldLabel}` for en-US and `{fieldLabel} verringern` for de-DE, and assembling those from pieces cannot produce both.

The locale rides on the config, which is provided per app and therefore per request. It is deliberately not a module-level singleton the way Vant's `Locale.use()` is: under SSR that leaks the language of whichever request rendered last into another request's HTML. Like the rest of `KunUIConfig` it is read once where it is used, so switching language at runtime means re-providing the config and re-keying the subtree.

Two places run outside `setup()` and cannot inject anything, so they get explicit hatches rather than a wrong answer. `useKunAlert` is a module-level store: leave `confirmText` / `cancelText` unset and `KunAlertProvider` — a real component — resolves them. `useKunCopy` runs from an event handler and now takes its two toast strings as an optional second argument; `KunCopy` passes the resolved ones, and a direct caller not on zh-CN should do the same.

Two deliberate behaviour changes beyond the wiring: KunDatePicker's six English accessible names are Chinese under `zh-CN` now (they were the inconsistency, not the baseline), and `useSpoilerContent`'s clipboard failure `console.error` is English, since it is addressed to the developer.

New exports: `useKunLocale`, `translateKunMessage`, `defineKunLocale`, `kunLocaleZhCN`, and the `KunLocale` / `KunMessages` / `KunMessagePath` / `KunTranslate` types. `useKunLocale` is auto-imported in the Nuxt layer. See §7.2 of `docs/INTEGRATION.md`.
