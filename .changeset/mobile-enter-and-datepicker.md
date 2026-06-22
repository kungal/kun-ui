---
"@kungal/ui-vue": patch
---

fix: DatePicker month/year nav closing on mobile; Enter key hijacked to "Next"

- **DatePicker**: the calendar panel is teleported to `<body>`, so its month/year
  nav buttons were treated as outside-clicks and closed the picker (felt on mobile,
  where you must tap the nav). Added the same `dropdownRef.contains` guard that
  Select/Autocomplete already use; outside clicks still close it.
- **Mobile "Next" key**: on a page with several fields the virtual keyboard shows a
  "Next" action that jumps to the next field instead of firing Enter — breaking
  inputs whose Enter does an in-component action. Declared `enterkeyhint` on those:
  TagInput (`enter`, add tag), Autocomplete & searchable Select (`done`, pick the
  active option), Pagination jump field (`go`). Plain Input/Textarea/NumberInput/
  PinInput are unchanged (field-to-field "Next" is correct there).
