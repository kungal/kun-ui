---
'@kungal/ui-vue': minor
---

**Horizontal KunTab with `fullWidth` now splits the width between its tabs.** Until now the strip filled its container, but the tabs stayed packed at the start. On the solid, light and bordered variants that left an empty track to their right. On underlined and pills, `fullWidth` changed nothing you could see. Each tab now takes an equal share, and a tab is never narrower than its label. If the tabs do not fit, the strip scrolls as before. The sliding indicator follows the wider tabs. A vertical `fullWidth` column is unchanged.

If you set `fullWidth` on a horizontal strip and want the old packed layout, remove it. The strip then keeps only its content width, so wrap it in a full-width element if you need that.

Two fixes for disabled tabs:

- **Hover:** a disabled tab no longer turns to the foreground colour under the pointer. CSS `:hover` also matches disabled buttons.
- **Cursor:** in a strip with `disabled`, every tab now shows the not-allowed cursor. Before, only the gaps between the tabs did, because each tab's own pointer cursor overrode the strip's.
