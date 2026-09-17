---
'@kungal/ui-vue': patch
---

**A tapped toast no longer stays paused on a phone.** The countdown paused on `mouseenter`, and browsers follow a tap with compatibility mouse events: a `mouseenter`, and no `mouseleave` until the next tap somewhere else. So one tap on a toast's text stopped it until the user touched the page again. Hover is now read from `pointerenter` / `pointerleave` and ignores `pointerType: 'touch'`: a finger pauses the toast only while it is pressed, and the countdown resumes when it lifts. A mouse or pen resting on the toast still holds it, a finger tapping beside that mouse does not release it, and the clicks, repeats and swipes changed in 2.40.1 behave as before. This matches Radix Toast and React Aria's `useHover`, and the Flutter port, where hover is a mouse's alone.
