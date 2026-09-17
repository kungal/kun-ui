import { ref } from 'vue'

// Chrome 152.0.7977.8, measured over CDP `Input.imeSetComposition`: while a
// Pinyin IME is still composing, the Enter that commits the candidate reaches
// the page as an ordinary keydown — key 'Enter', keyCode 13, isComposing true.
// A listbox that acts on it selects an item the user never chose; the arrow keys
// that walk the candidate list move the highlight the same way. Every key
// handler bound to a text input has to skip these. keyCode 229 is the same
// signal on engines that predate `isComposing`
// (https://w3c.github.io/uievents/#determine-keydown-keyup-keyCode).
export const isImeComposing = (e: KeyboardEvent) => e.isComposing || e.keyCode === 229

// For a text input bound with `:value` + `@input` rather than `v-model`: puts
// back both halves of the composition handling runtime-dom's `vModelText`
// would have supplied. Measured over CDP `Input.imeSetComposition`, typing 你好
// through a Pinyin IME:
//
// - Without its input guard, every romaji keystroke was committed. KunInput's
//   model went "n", "ni", … "nihao", 你好 (Chrome 153), and KunSelect
//   re-filtered until the panel collapsed to `noResultText` under the open
//   candidate window, after five @search emits (Chrome 152).
// - Without its skip of `el.value` writes while composing, any re-render
//   patched the field back to the committed text. Hovering an option in
//   KunSelect or KunAutocomplete re-renders the highlight: the pinyin vanished,
//   no compositionend followed, the guard stayed shut, and the word the user
//   then committed never arrived (Chrome 153). So bind
//   `:value="composingText ?? value"` — the field's own text while composing.
//
// `commit` gets the value off the event, and can get the same text twice:
// compositionend and the browser's own final `input` both carry it.
export const useImeComposition = (commit: (value: string) => void) => {
  const composingText = ref<string | null>(null)
  const valueOf = (e: Event) => (e.target as HTMLInputElement).value

  return {
    composingText,
    onCompositionStart: (e: CompositionEvent) => {
      composingText.value = valueOf(e)
    },
    onCompositionEnd: (e: CompositionEvent) => {
      composingText.value = null
      commit(valueOf(e))
    },
    onInput: (e: Event) => {
      if (composingText.value === null) commit(valueOf(e))
      else composingText.value = valueOf(e)
    },
  }
}
