---
'@kungal/ui-vue': patch
---

KunTextarea: defer the first auto-grow height measurement to the next animation frame. Measuring `scrollHeight` synchronously in `onMounted` could read a too-tall height before the textarea was laid out (notably a chat input that first appears on mobile), which only corrected itself on the first keystroke. The deferred measure runs after layout, so an auto-grow textarea starts at its true single-row height.
