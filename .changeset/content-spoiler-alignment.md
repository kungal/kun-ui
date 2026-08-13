---
"@kungal/ui-vue": patch
---

fix(vue): KunContent spoilers no longer shift the text they cover

`.kun-spoiler` was given `display: inline-block; overflow: hidden;
vertical-align: middle` unconditionally, and none of it was released on reveal —
so a revealed spoiler stayed misaligned with the prose around it forever.

The root cause was `overflow: hidden`. It only existed to clip a `border-radius`
that was dropped when the particle cover landed, and any non-`visible` overflow
moves an inline-block's baseline to its bottom margin edge (CSS 2.1 §10.8.1).
`vertical-align: middle` was compensating for that: measured against the
surrounding text at prose metrics, `overflow` alone pushed the spoiler text
**-8.00px** off the baseline and `middle` pulled it back to **+0.95px** — closer,
but still wrong, and it left the whole line ~1px taller than its neighbours.

Both are gone. What remains — `position: relative` and `display: inline-block`,
needed because the particle canvas is sized from `clientWidth`/`clientHeight`
(0 on a non-replaced inline box) and positioned against this element — now
applies only while the cover is up (`.kun-spoiler-hidden`) or the canvas is
still dissolving (`.kun-spoiler-live`), so a revealed spoiler is a plain inline
again and leaves no trace. Block-level spoilers use `display: flow-root` for the
BFC that keeps their child `<p>` margins inside the covered box, instead of
`overflow: hidden` and its clipping/scroll-container side effects.

Measured on the real component, revealed state, against a spoiler-free control
paragraph:

| | before | after |
| --- | --- | --- |
| inline spoiler text vs. surrounding text | +0.95px | **0** |
| line height (control: 30.60px) | 31.55px | **30.60px** |
| paragraph with a long spoiler (natural: 91.80px) | 122.40px | **91.80px** |
| does a long spoiler flow with the text | no | **yes** |

Downstream overrides that reset `display` / `vertical-align` on `.kun-spoiler`
can be removed — they were tying with the component's own `(0,3,0)` selector and
winning only on stylesheet order.
