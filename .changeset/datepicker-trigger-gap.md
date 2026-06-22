---
"@kungal/ui-vue": patch
---

fix(vue): DatePicker trigger — gap + truncation between text and calendar icon

The trigger only had `justify-between` (no gap), so in a narrow field the
placeholder/value text butted right against the calendar icon with no spacing
(and looked vertically off). Adopted the Select trigger's pattern: `gap-2` on the
button, `min-w-0 flex-1 truncate` on the text, and `shrink-0` on the icon group —
so there's always an 8px gap, the text truncates gracefully, and the icon stays
put. (Audited Select, Autocomplete and the input family — they already do this;
DatePicker was the only one missing it.)
