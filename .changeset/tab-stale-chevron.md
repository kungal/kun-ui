---
'@kungal/ui-vue': patch
---

`KunTab` no longer leaves a "›" scroll chevron on a strip whose tabs fit. The sliding indicator is absolutely positioned inside the tab list, and it counted toward the strip's scroll width. When the strip narrowed with a later tab active, the measurement caught the indicator mid-slide at its old, wider position: 360 px of content in a 344 px strip, measured in a sticker panel resized from a 1280 to a 360 px window. The chevron appeared, and nothing measured again once the indicator settled. The tab list now clips the indicator horizontally (`overflow-x: clip`, inline), so neither a sliding indicator nor a rounding pixel past the last tab can register as overflow. The indicator's appearance is unchanged, and strips that really overflow keep their fade and chevrons.
