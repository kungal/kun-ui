---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

Menus gain separators, shortcut hints and one level of submenu, and a new `KunKbd` shows keyboard shortcuts. Everything is additive: existing `items` arrays and props render exactly as before.

**KunContextMenu and KunDropdown** share one item list, so an app can render the same command list as a right-click menu, a ⋯ menu and a long-press menu. `items` now takes `KunMenuEntry[]`, which is an item or `{ type: 'separator' }`. `KunContextMenuItem[]` arrays are still accepted.

- **Separators.** Leading, trailing and repeated separators are dropped, so a list filtered per context never shows a stray line.
- **Shortcuts.** `shortcut: 'Mod+C'` shows ⌘C on Apple and Ctrl+C elsewhere at the item's end. It is display only; your app still binds the key. Screen readers read the item's label as its name and the shortcut as its description.
- **Submenus.** `children` opens a submenu, one level deep.
  - Opening: hover (after 100 ms), →, Enter or a tap.
  - Closing: ← and Escape close one level, as the WAI-ARIA menu pattern specifies; Tab closes the whole menu.
  - A 300 ms grace period and a safe triangle keep the submenu open while the pointer moves diagonally towards it.
  - An item with `children` never emits `select`; if a filter leaves it no child items, it shows disabled. Selecting a submenu item emits that item and closes everything.
- **Keyboard.** KunContextMenu now has the type-ahead KunDropdown already had. ↑ in a menu with nothing focused yet, such as right after a click opened it, now goes to the last item. Before, it went to the second-to-last.
- **Link items.** Enter or Space on an `href` item now follows the link. Before, it emitted `select` and closed without navigating.

**KunKbd** takes `keys` in the aria-keyshortcuts grammar plus `Mod`: `+` joins a chord and a space separates a sequence, e.g. `'Mod+K'`, `'Shift+Delete'`, `'G G'`.

- **Order.** Modifiers sort into each platform's order: ⌃⌥⇧⌘ on Apple, Ctrl+Win+Alt+Shift elsewhere.
- **Screen readers** hear key names ("Command K"), not glyphs.
- **Size** is in em, so it follows the surrounding text.
- **Variants.** `variant="plain"` is the one-line form menus use: ⇧⌘Z, or Ctrl+Shift+Z.
- **Server rendering.** The server cannot know the visitor's keyboard, so it renders the Ctrl form; a Mac switches to ⌘ once the page has mounted. Components created afterwards, such as a menu or tooltip opening, start in the right form.
- **Related APIs:**
  - `KunTooltip` gains `shortcut`: `text="Search" shortcut="Mod+K"` renders "Search Ctrl K".
  - `KunCommandPalette`'s `trigger` slot also passes `keys` for use with KunKbd.
  - `useKunShortcutPlatform()` and `formatKunShortcut()` are exported for your own markup.
  - The parser and formatter live in `@kungal/ui-core`, so the Flutter port renders the same labels.

**KunChip and KunTagInput:** the × remove button now has a 24×24 px hit area. The glyph did not change size: it was 14 px in KunChip and 18 px in KunTagInput, which is under WCAG 2.2's 24 px minimum. The hit area is not clipped: in Chromium, a clipped one measured worse than none, because it switches off the browser's own tap adjustment.

`useKunFloating`'s `offset` option now accepts floating-ui's full `OffsetOptions` (for example `{ mainAxis, crossAxis }`), not just a number.
