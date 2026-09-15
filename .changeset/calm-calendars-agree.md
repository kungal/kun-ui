---
'@kungal/ui-vue': patch
---

KunDatePicker's calendar grid follows the active locale instead of always being English.

The calendar is dates, not strings, so the locale that now carries KunUI's text did not reach it — and the grid's own language defaulted to `en-US` regardless. On a `lang="zh-CN"` page the panel rendered `Su Mo Tu We Th Fr Sa` above buttons reading 今天 / 清空 / 关闭, and every day cell announced an English `toDateString()` — `"Sun Aug 30 2026"`. That last one matters more than it looks: the column headers are deliberately `aria-hidden` (following react-aria's `useCalendarGrid`), so the cell label is the *only* place a screen reader hears the weekday at all.

`KunLocale` now carries a `dateLocale` next to `messages`, and the grid resolves:

```
KunDatePicker `locale` prop  >  KunLocale.dateLocale  >  KunLocale.code  >  en-US
```

The same zh-CN page now renders `日 一 二 三 四 五 六` and announces `2026年8月30日 星期日`; under `@kungal/ui-vue/locale/en` it renders `Su Mo Tu` and `Sunday, August 30th, 2026`. Day cells use date-fns' `PPPP`, which carries the weekday in every locale date-fns ships — shortening that pattern would silently break the `aria-hidden` headers' contract.

The month grid's cell label was `` `${month} ${year}` `` glued together at the call site, which reads backwards in Chinese; it is a `datePicker.monthCell` template now (`{year}年{month}` vs `{month} {year}`), for the same reason every other interpolated string here is one template.

**Nothing to change if you already pass `locale`** — the prop still wins, still takes a tag, and still only governs the grid, so `<KunDatePicker locale="ja" />` in a zh-CN app keeps giving you a Japanese calendar with Chinese buttons. Only `zh-CN` / `ja` / `en` are bundled as tags; any other language supplies a date-fns locale object via `KunLocale.dateLocale`, since the grid cannot be localized by `messages` alone.

Also documents `KunDatePicker`'s `locale` and `weekdays` props, which had no JSDoc and so appeared blank in the docs PropsTable.
