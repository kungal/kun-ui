---
"@kungal/ui-vue": minor
---

**Content spoilers**: the particle mask now follows the real text shape. Multi-line spoilers are masked **line-by-line**, and space-separated text is masked **word-by-word** (gaps at spaces and ragged line ends stay clear) instead of one solid block — the cover lines up with how the text actually flows. CJK / no-space text degrades naturally to per-line masking.

Word/line rectangles are measured once per layout via the Range API (never per frame), and the per-frame cost stays capped (the particle budget and tint fills are independent of text length), so animation never janks regardless of size. The markup contract is unchanged (`class="kun-spoiler kun-spoiler-hidden"`).
