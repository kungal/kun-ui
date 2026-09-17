---
'@kungal/ui-vue': patch
---

**A second finger no longer strands a sheet halfway through a swipe.** When a second finger touched down during a drag-to-dismiss on a KunModal or KunDrawer sheet, the drag was dropped with its transform still applied, and nothing moved the panel again (the Flutter port measured it at +40px). Now the finger that started the drag controls it until that finger lifts, the same way the Flutter port's gesture recognizer tracks only its first pointer. Other fingers are ignored, and lifting one of them does not end the drag. Their moves are still cancelled, so the page cannot pinch-zoom under the sheet. Without that, a second finger spreading away zoomed the page to 5× in Chrome 153. A second finger that lands before the drag has started is still a pinch, not a dismiss.
