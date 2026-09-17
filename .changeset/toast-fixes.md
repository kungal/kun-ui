---
'@kungal/ui-vue': patch
---

Three fixes to the `useKunMessage()` toast, reported by the Flutter port.

- **The type icon now shows its own shade.** The icon is meant to be one step brighter than the message: `success-500` beside `success-800` text, and the same for `error`, `warn` and `info`. A rule that makes the rest of the toast inherit its text color also overrode the icon's class, so every icon has rendered in the message color until now. Toast icons are now brighter on every site. Each clears 3:1 against its toast background in both modes; the lowest is `success` in light mode at 3.17:1.
- **A click no longer restarts the countdown under the mouse.** The countdown pauses while the mouse is on the toast. Until now, releasing a click, letting a short drag snap back, or triggering the same toast again restarted it with the mouse still there, and the toast closed under the cursor. It now runs only while no mouse is on the toast and nothing is pressed on it, and the progress bar pauses with it.
- **A swiped toast now leaves the way it was thrown.** Past the threshold, it used to freeze where it was released and vanish about 50 ms later. It now travels one more toast-width in the swipe direction and fades out over `--kun-dur-exit` with `--ease-kun-in`, the timing a swiped-away bottom sheet uses (`KunDurations.exit` and `KunEasing.exit` in `kun_ui_tokens`). With reduced motion, it still disappears at once. The hardcoded `0.2s` transition, which never took effect, is gone.
