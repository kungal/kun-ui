// Chrome 152.0.7977.8, measured over CDP `Input.imeSetComposition`: while a
// Pinyin IME is still composing, the Enter that commits the candidate reaches
// the page as an ordinary keydown — key 'Enter', keyCode 13, isComposing true.
// A listbox that acts on it selects an item the user never chose; the arrow keys
// that walk the candidate list move the highlight the same way. Every key
// handler bound to a text input has to skip these. keyCode 229 is the same
// signal on engines that predate `isComposing`
// (https://w3c.github.io/uievents/#determine-keydown-keyup-keyCode).
export const isImeComposing = (e: KeyboardEvent) => e.isComposing || e.keyCode === 229
