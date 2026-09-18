---
'@kungal/ui-vue': patch
---

**Keyboard fixes for KunTab, KunSelect and KunDatePicker:**

- **KunTab focus ring:** on a selected `solid` or `pills` tab, the keyboard focus ring now shows in the tab's text colour straight away. It used to start in primary and fade to the text colour over about 250ms, because the tab's colour transition also animated the ring's colour away from the global default.
- **KunSelect clear button and chip ×, and KunDatePicker's clear button:** these no longer take keyboard focus. They were Tab stops inside the field, but Enter or Space on them opened the popup instead of clearing or removing anything. Use **Backspace** or **Delete** on the focused field instead:
  - A single KunSelect with `clearable` is cleared.
  - A `multiple` KunSelect loses its last value, whether or not it is `clearable`.
  - A KunDatePicker with `clearable` is cleared.
  - This works whether the popup is open or closed. In a `searchable` Select, Backspace inside the search field still only edits the search text.
  - The buttons still work with the mouse or touch.

  Screen readers no longer see these buttons either. Their labels were being read as part of the field's value: a multiple Select holding Clannad and Fate was announced as "Clannad Remove Clannad Fate Remove Fate Clear". It is now announced as "Clannad Fate". HeroUI's Select and react-select handle these buttons the same way, and the ARIA spec says a combobox's icon button should not be in the Tab order or inside the combobox element.

  Tab order is shorter too: a `multiple` Select with N chips was N + 2 Tab stops and is now one.
