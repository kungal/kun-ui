---
'@kungal/ui-vue': patch
---

Every type in `components/types` is now exported from the package root. Thirteen had been left off the hand-kept list. As a result, `import type { KunStepItem } from '@kungal/ui-vue'`, the import the KunSteps docs examples use, failed with TS2614. The thirteen are `KunStepItem`, `KunStepsProps`, `KunStepsSize`, `KunTimelineProps`, `KunTimelineItemProps`, `KunAccordionProps`, `KunAccordionItemProps`, `KunCarouselProps`, `KunCarouselItemProps`, `KunSkeletonProps`, `KunTabPanelProps`, `KunTabPanelsProps` and `KunCardPadding`.

The root now re-exports the whole module with `export type *`, so a new component's types can no longer be missed. That syntax needs TypeScript 5.0 or later in the consuming project.
