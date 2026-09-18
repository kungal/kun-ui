---
'@kungal/ui-vue': patch
---

KunSelect's clear button is back in reach of screen readers. 2.42.1 hid it (`aria-hidden`) to keep its label out of the combobox's value, which left touch screen-reader users — TalkBack, VoiceOver on a phone — with no way to clear a clearable single Select: Backspace / Delete needs a hardware keyboard, and picking the chosen option again keeps it. A `multiple` Select could still untick options in the list, and KunDatePicker's panel has its own Clear button, so only the single Select was stuck.

The `role="combobox"` element is now the value inside the trigger box rather than the box itself, and the clear button sits beside it, not in it. That is the shape WAI-ARIA gives a combobox's icon button — "focusable but not included in the page Tab sequence, and … not a descendant of the element with role combobox" — and the one MUI's Autocomplete, Base UI's `Combobox.Clear` and Vuetify's clearable field use. The button is labelled "Clear" again and still out of the Tab order; the combobox's value reads "Clannad", not "Clannad Clear"; activating the button returns focus to the combobox. Backspace / Delete on the combobox work as in 2.42.1.

What changes for you: `classNames.trigger` lands on the box — border, background, padding, focus ring — which is where it always rendered, and the keyboard focus ring is drawn there when the combobox inside has focus. Measured in Chromium against 2.42.1, the trigger lays out identically at every `size`, with chips wrapping to three rows, and with `fullWidth: false`. Code that reads the geometry of `[role="combobox"]` now gets the value area, not the whole box.

A chip's × stays hidden, because it has to sit inside the combobox: Backspace / Delete removes the last value from the keyboard, and a screen reader unticks the option in the list.
