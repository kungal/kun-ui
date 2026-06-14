---
"@kungal/ui-vue": minor
---

feat(vue): every text control's focus ring follows its `color` prop (default `default`)

The focus-ring color was inconsistent across the form family: some controls tied
it to their `color` prop (Input/NumberInput/CheckBox), others hardcoded a primary
ring (Textarea/Select/Autocomplete/DatePicker/Pagination), and even among the
first group the default differed (Input defaulted `color: 'default'` → grey ring;
NumberInput defaulted `color: 'primary'` → blue ring). So an Input and a Textarea
side by side focused in different colors.

Now uniform: every text control's focus ring routes through its `color` prop, and
they all default to **`'default'`** (a neutral grey ring) — `color="primary"` (etc.)
themes it. `color="success"`/`"danger"`/… give that ring; an invalid control still
overrides to a danger ring.

- **New `color?: KunUIColor` prop** on `KunTextarea`, `KunSelect`,
  `KunAutocomplete`, `KunDatePicker` (default `'default'`).
- **`KunNumberInput` default `color` changed `'primary'` → `'default'`** so an
  un-themed number input matches the rest (grey ring, was blue).
- `KunPagination`'s jump input uses the neutral ring.

Also: **`KunCard` footer no longer draws a top border** — it's just a section
spaced by the card's own gap, matching the (already borderless) header.
