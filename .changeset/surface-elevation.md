---
"@kungal/ui-tokens": minor
"@kungal/ui-vue": minor
---

feat(tokens,vue): surface-elevation system — cards & inputs pop by fill+shadow, not borders

Move from a border-defined look to an elevation scale. The page background is now
a soft neutral (light `#f5f5f7`, dark near-black `#0a0a0a`) instead of pure
white/black, so raised surfaces read as raised:

- **Card** is a raised surface — `bg-content1` (`#fff` / `#18181b`) + `shadow-kun-sm`;
  border is now OFF by default (`bordered` is opt-in). It no longer shares the
  page background.
- **Inputs are borderless and share the card surface**: Input, Textarea, Select,
  NumberInput, TagInput, PinInput, Autocomplete, DatePicker trigger and the
  Pagination field use `bg-content1` + `shadow-kun-sm` (same fill as a card, lifted
  by a small shadow). The error state is a danger **ring**, not a border.
- **Floating panels lose their border** and rely on shadow + the `content1`
  surface: Dropdown, Select/Autocomplete lists, ContextMenu, Popover, Tooltip,
  DatePicker calendar, Modal, Drawer.
- **Placeholder** now uses a theme-adaptive `::placeholder` colour (the browser
  default grey didn't follow light/dark).

Visual change only; component APIs are unchanged except `KunCard`'s `bordered`
default (true→false) and `KunTagInput`'s `variant` default (bordered→flat).
