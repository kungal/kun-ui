---
'@kungal/ui-vue': patch
---

**Screen readers and KunInfo spacing:**

- **KunSwitch:** screen readers now announce it as a switch instead of a checkbox. It is still a native checkbox, now with `role="switch"`, so the on/off state still comes from `checked`.
- **KunNull:** the empty-state image is now decorative (`alt=""`). It used to have the hard-coded English alt text "empty", which was read before the description in every language. The description text already says what the image shows.
- **KunInfo with no title, no icon and no `#title` slot:** it no longer renders an empty heading. That empty heading added 8px above the description. A description-only info box is now 54px tall instead of 62px.
- **KunInfo classes that did nothing:** removed `bg-opacity-20`, which Tailwind v4 no longer generates, and a `bg-transparent` that `cn()` always dropped from `bordered`. Nothing changes on screen: `bordered` still shows the 15% tint in every colour.
