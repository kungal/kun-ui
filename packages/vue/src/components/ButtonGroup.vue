<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import type { KunButtonGroupProps } from './types'

defineOptions({ name: 'KunButtonGroup' })

const props = withDefaults(defineProps<KunButtonGroupProps>(), {
  orientation: 'horizontal',
  ariaLabel: undefined,
  className: '',
})
</script>

<template>
  <div
    class="kun-button-group"
    :data-orientation="orientation"
    :class="
      cn(orientation === 'vertical' ? 'inline-flex flex-col' : 'inline-flex', className)
    "
    role="group"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>

<!-- Global (unscoped) so the seam rules reach slotted children AND a button
     nested one/two levels inside a wrapper — e.g. a KunPopover trigger
     (`div > div > button`). The KunPopover PANEL teleports to <body>, so it is
     NOT a descendant here: only the trigger button is squared, never the menu's
     own buttons. Same idiom as KunTimeline's `.kun-timeline > li ...` block. -->
<style>
/* Isolate so a hover/focus-raised segment stacks within the group, not the page. */
.kun-button-group {
  isolation: isolate;
}
.kun-button-group > * {
  position: relative;
}
/* The hovered/focused segment floats above its neighbour so its full border and
   focus ring paint over the shared 1px seam instead of being clipped by it. */
.kun-button-group > *:hover,
.kun-button-group > *:focus-within {
  z-index: 10;
}

/* ── Horizontal: collapse the vertical seams between segments ── */
.kun-button-group[data-orientation='horizontal'] > *:not(:first-child) {
  margin-left: -1px;
}
.kun-button-group[data-orientation='horizontal'] > *:not(:first-child),
.kun-button-group[data-orientation='horizontal'] > *:not(:first-child) :where(button, a) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.kun-button-group[data-orientation='horizontal'] > *:not(:last-child),
.kun-button-group[data-orientation='horizontal'] > *:not(:last-child) :where(button, a) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* ── Vertical: collapse the horizontal seams between segments ── */
.kun-button-group[data-orientation='vertical'] > *:not(:first-child) {
  margin-top: -1px;
}
.kun-button-group[data-orientation='vertical'] > *:not(:first-child),
.kun-button-group[data-orientation='vertical'] > *:not(:first-child) :where(button, a) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.kun-button-group[data-orientation='vertical'] > *:not(:last-child),
.kun-button-group[data-orientation='vertical'] > *:not(:last-child) :where(button, a) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
