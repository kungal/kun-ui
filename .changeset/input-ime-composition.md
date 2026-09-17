---
'@kungal/ui-vue': patch
---

**KunInput waits for IME composition, as KunTextarea does.** Typing 你好 with a Pinyin IME used to emit `n`, `ni`, … `nihao`, then `你好` through `v-model`. It now emits `你好` once, when the word is committed. That is what KunTextarea has always done, because Vue's own `v-model` guard handles it there. The model is still a string under `type="number"`, which is why KunInput does not simply use `v-model` on its `<input>`. One cost: a keyboard that composes Latin text too, as some Android keyboards do, now updates the model once per committed word rather than once per letter. If you need the text before it is committed, listen to the native `input` event, which KunInput forwards to its `<input>`.

**Re-rendering during composition no longer erases the text being composed**, in KunInput, a searchable KunSelect and KunAutocomplete. These fields bind `:value`, and any re-render while the IME was composing wrote the field back to its committed text. In KunSelect and KunAutocomplete, moving the mouse over the options was enough, because the highlight re-renders: the pinyin disappeared and the IME never sent `compositionend`. The word the user committed next then never reached the model or `@search`. While composing, the fields are now bound to the text they already contain.
