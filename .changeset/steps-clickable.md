---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

**`KunSteps` steps are clickable** when you bind `v-model:current`. Each step becomes a `<button>` whose hit area covers the whole step (indicator, title and description), and a click emits `update:current` with the step's index. With a plain `:current` nothing changes. The steps stay display-only, with the same layout as before, so a stepper that shows review status does not gain buttons that do nothing.

- `linear` (default `true`) lets a click go back to any earlier step but never forward. Forward moves stay behind your own "next" button and its validation. This is MUI's linear rule. Reka UI also allows one step forward, which would skip that validation. `:linear="false"` makes every step reachable, for a guide whose steps do not depend on each other.
- `items[].disabled` excludes one step from click navigation. It has no visual effect.
- `items[].status: 'error'` marks a step failed (danger colour and an ✕), wherever it sits relative to `current`. One example is an application rejected at review.
- Keyboard: every reachable step is a Tab stop, and Enter or Space selects it. There is no arrow-key navigation, and the list is not a `tablist`, because no panel exists for a step to control. KunTab draws the same line in its link mode, and React Spectrum's StepList, Mantine and Carbon make the same choice. Focus stays on the step you activated.
- Screen readers now hear each step's state, in display-only mode too. A visually hidden prefix is read before the title: "Completed: …", "Current step: …", "Not started: …" or "Error: …". Before this change, a done step and a pending one sounded the same.
  - The strings are the new `steps` namespace in the locale catalogs. A custom `KunLocale` must add `steps.completed`, `steps.current`, `steps.pending` and `steps.error`, each taking `{title}`.
  - `kun_ui_messages` gains `KunStepsStrings` to match.
- In display-only mode the indicator is now `aria-hidden`, because its number or icon repeated what the list position and the state prefix already say.
