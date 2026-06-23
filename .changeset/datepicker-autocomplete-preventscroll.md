---
"@kungal/ui-vue": patch
---

fix(vue): DatePicker / Autocomplete focus-on-open no longer risks scrolling the page

Hardens the two remaining popup components that still used a bare `.focus()`:
DatePicker (focus the root on open) and Autocomplete (refocus the input after
select / clear) now pass `{ preventScroll: true }`. The menu components already
did this; this brings the last two in line so a portaled-panel open can never
jump the page to the top. (The public `Autocomplete.focus()` method keeps the
default so the caller controls scroll intent.)
