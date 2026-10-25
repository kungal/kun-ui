---
'@kungal/ui-vue': patch
---

**KunTextarea: the character counter no longer covers the last line of text.** With `showCharCount`, the counter sat over the bottom-right corner of the text area. A long, auto-growing entry ran its last line under it. The textarea now reserves 24px of bottom padding for the counter, so the text stops above it.
