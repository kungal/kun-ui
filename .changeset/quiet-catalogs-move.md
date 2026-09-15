---
'@kungal/ui-vue': minor
---

KunUI's own strings moved to `@kungal/ui-core`. Nothing you import has to change.

The two catalogs — `zh-CN` and `en` — now live in `@kungal/ui-core` as plain
data, next to the variant matrix and the radius system, instead of inside the
Vue layer. `@kungal/ui-vue` re-exports everything it exported before
(`KunMessages`, `KunMessagePath`, `translateKunMessage`, `defineKunLocale`,
`kunLocaleZhCN`, and `@kungal/ui-vue/locale/en`), so a Vue app sees no
difference at all.

Why move them: a locale is 91 strings of plain data, and every render layer
needs the same 91. Leaving them in `@kungal/ui-vue` would have made the Vue
package the upstream of the planned React layer, and of the Flutter port, for
text that has nothing to do with Vue. They are authored as JSON now, which is
also what lets a build-time generator read them without evaluating TypeScript.

New, if you want it:

- `@kungal/ui-core` exports `KUN_CATALOG_ZH_CN`, `translateKunMessage` and the
  `KunMessages` / `KunMessageCatalog` / `KunMessagePath` types;
  `@kungal/ui-core/locale/en` exports `KUN_CATALOG_EN`. Only the catalog you
  import is bundled, exactly as before.
- A `KunLocale` is now a catalog plus the one field that cannot leave the web:
  `dateLocale`, the date-fns locale backing `KunDatePicker`'s calendar grid.

Every string is byte-identical to 2.36.0 — both catalogs were read back out of
the previous release and all 182 values compared. Rendered output does not
change.

The Flutter contract gained one thing alongside this: the sixteen props whose
default comes from the locale now carry it structurally as
`defaultFrom: { "locale": [...] }`, not only as prose, and the generator fails
if such a path is not a real message key.
