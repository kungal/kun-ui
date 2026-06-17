<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import type { KunTimelineProps } from './types'

// Vertical timeline container. Put <KunTimelineItem>s inside (default slot); the
// connecting line is drawn by each item and the trailing segment under the last
// dot is hidden via the global rule below (deterministic, no JS / measurement).
defineOptions({ name: 'KunTimeline' })

withDefaults(defineProps<KunTimelineProps>(), { className: '' })
</script>

<template>
  <ol :class="cn('kun-timeline relative', className)">
    <slot />
  </ol>
</template>

<!-- Global (not scoped): KunTimelineItem renders sibling <li>s, so the last-line
     rule has to reach across component boundaries. Direct-child selector keeps
     it scoped to this timeline's own items. -->
<style>
.kun-timeline > li:last-child .kun-tl-line {
  display: none;
}
.kun-timeline > li:last-child .kun-tl-content {
  padding-bottom: 0;
}
</style>
