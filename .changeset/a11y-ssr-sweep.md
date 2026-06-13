---
"@kungal/ui-vue": minor
---

Accessibility + SSR-correctness sweep across the library.

- **SSR-stable ids (the big one).** `useKunUniqueId` deferred Vue's `useId()` to
  `onMounted`, so the server HTML rendered empty ids — every `<label for>` /
  `id` pairing was broken on the server and changed on hydration. It now calls
  `useId()` synchronously (Vue guarantees it's identical server/client), so
  KunInput / KunCheckBox / KunTextarea / etc. have correct, stable label
  associations in the SSR HTML.
- **KunModal dialog semantics.** The panel was missing `role="dialog"` /
  `aria-modal="true"` / an accessible name — now added, plus an `ariaLabel` prop.
  (KunDrawer already had these.)
- **Accessible names on icon-only buttons.** KunModal & KunLoli close buttons and
  KunPagination prev/next now have `aria-label` (the icon itself is `aria-hidden`,
  so these announced as just "button" before).
- **KunPagination semantics.** Wrapped in `<nav aria-label>`; numbered pages get
  `aria-label` + `aria-current="page"` on the active page.
- **KunSlider keyboard (WCAG 2.1.1).** The thumb now responds to Arrow keys
  (±step), PageUp/PageDown (±10×), Home (min) and End (max) — it was drag-only.
- **KunMessage live region.** Toast containers are now `role="status"`
  `aria-live="polite"`, so screen readers announce toasts.
- **KunTooltip keyboard/SR.** Now shows on focus (not just hover), links its text
  via `aria-describedby`, and dismisses on Escape.
- **KunRating** stars gained `aria-label` (the `title` alone wasn't announced).
- **KunPopover** dialog gained an `ariaLabel` prop / accessible name.

All non-breaking. The id change improves SSR output; the new `ariaLabel` props on
KunModal/KunPopover default to a generic name when omitted.
