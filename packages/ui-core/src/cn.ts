import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { KUN_TW_SCALES } from './twScales.generated'

// tailwind-merge only ships Tailwind's OWN scales, so every name KunUI mints in
// `@theme` / `@utility` was invisible to it and got passed through untouched:
// `cn('rounded-kun-md', 'rounded-full')` returned both classes and left CSS
// source order to pick the winner. Measured, a consumer passing
// `classNames.trigger: 'rounded-full'` to KunSelect still rendered a 12px
// radius — the documented "your class wins" contract was false for the whole
// `rounded-kun-*`, `shadow-kun-*`, `z-kun-*`, `ease-kun-*` and `duration-kun-*`
// surface.
//
// `shadow-kun-*` failed worse than the rest. The shadow COLOUR group's
// validator accepts any non-arbitrary word, so `shadow-kun-md` was classified
// as a colour: it resolved against `shadow-primary/20` and the box-shadow was
// the class that got dropped.
//
// The scale names are generated from tokens.css (`pnpm gen`) because a drifted
// hand-written list fails silently — nothing errors, the classes just stop
// merging again.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: [...KUN_TW_SCALES.radius],
      shadow: [...KUN_TW_SCALES.shadow],
      ease: [...KUN_TW_SCALES.ease],
      animate: [...KUN_TW_SCALES.animate],
    },
    // z-index and transition-duration are not Tailwind v4 theme namespaces —
    // these are `@utility` blocks, so they extend the class group directly.
    classGroups: {
      z: [{ z: [...KUN_TW_SCALES.z] }],
      duration: [{ duration: [...KUN_TW_SCALES.duration] }],
    },
  },
})

// Merge Tailwind class names with conflict resolution. Framework-agnostic:
// the Vue and React layers both import this so "last class wins" semantics
// are identical everywhere.
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export type { ClassValue }
