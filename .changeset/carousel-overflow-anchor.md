---
"@kungal/ui-vue": patch
---

fix(vue): KunCarousel runaway auto-advance / "wild flicker" on Chromium

The seamless loop is a scroll-jacked container — it programmatically reorders
slides (CSS `order`) and resets `scrollLeft` to re-home. Chromium's default
**scroll anchoring** reacts to that reorder/reflow by nudging `scrollLeft` to keep
an anchor element in view; the re-home logic then misreads the nudge as "the user
moved to the next slide", advances, reorders again, and loops — so the carousel
races through slides far faster than the autoplay interval (looks like everything
flickering/stacking; reported on Chrome + Edge, desktop). The track now sets
`overflow-anchor: none`, handing scroll control entirely to the component. No API
or behaviour change otherwise.
