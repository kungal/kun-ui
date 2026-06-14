---
"@kungal/ui-vue": patch
---

fix(vue): single-line audit follow-ups (menu items, UserChip, Tooltip)

After a full sweep for which components carry a single-unit label vs. flowing
prose:

- **`KunDropdown` / `KunContextMenu`** menu-item labels now `truncate` (single
  line + ellipsis when the menu is width-constrained) with `shrink-0` icons,
  instead of wrapping to two lines.
- **`KunUserChip`** name and description now `truncate` (the text column gets
  `min-w-0`) — a long name ellipsizes on one line rather than wrapping past the
  avatar.
- **`KunTooltip`** dropped its unconditional `whitespace-nowrap` for `max-w-xs`:
  short tips still sit on one line, but a long tip now wraps inside ~20rem
  instead of being forced into one screen-wide line.

Prose components (Card / Modal / Alert / toast bodies, checkbox/radio/switch
labels, helper & error text) intentionally keep wrapping.
