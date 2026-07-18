---
"@kungal/ui-vue": minor
---

feat(vue): KunTab auto-handles horizontal overflow (scroll + edge fade + chevrons)

A horizontal tab strip that outgrows its container now scrolls **inside** the
container instead of widening the page — automatically, with no `scrollable`
flag and no manual overflow check. When the tabs overflow:

- the overflowing edge fades to transparent via a CSS mask — **background-independent**,
  so it reads clearly on any surface (unlike a colored scroll shadow that blends in);
- a chevron button floats on each scrollable side (opt out with `:scroll-buttons="false"`
  to keep just the fade);
- the active tab auto-scrolls into view, so ← / → keyboard nav always keeps the
  selection visible.

New prop: `scrollButtons?: boolean` (default `true`). The existing `scrollable`
prop now only governs *vertical* tab columns; horizontal overflow is handled
unconditionally.
