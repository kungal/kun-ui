<script setup lang="ts">
import { computed } from 'vue'
import {
  cn,
  kunSolidBgClasses,
  kunSolidFgClasses,
} from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import type { KunTimelineItemProps } from './types'

// One node on a <KunTimeline>: a coloured dot (or icon medallion) + a content
// column. `title` / `time` are convenience props; richer markup goes in the
// default slot. The connecting line is the `.kun-tl-line` element — KunTimeline
// hides it under the last item.
defineOptions({ name: 'KunTimelineItem' })

const props = withDefaults(defineProps<KunTimelineItemProps>(), {
  color: 'primary',
  icon: '',
  title: '',
  time: '',
  className: '',
})

const hasIcon = computed(() => !!props.icon)
</script>

<template>
  <li :class="cn('flex gap-3', className)">
    <!-- Gutter: dot/medallion + connecting line (stretches to item height) -->
    <div class="flex flex-col items-center self-stretch">
      <span
        v-if="hasIcon"
        :class="
          cn(
            'inline-flex size-7 shrink-0 items-center justify-center rounded-full',
            kunSolidBgClasses[color],
            kunSolidFgClasses[color]
          )
        "
      >
        <KunIcon :name="icon" class="size-4" />
      </span>
      <span
        v-else
        :class="
          cn('mt-1.5 size-3 shrink-0 rounded-full', kunSolidBgClasses[color])
        "
      />
      <span class="kun-tl-line bg-default-200 my-1.5 w-px flex-1" />
    </div>

    <!-- Content -->
    <div class="kun-tl-content min-w-0 flex-1 pb-6" :class="hasIcon ? 'pt-0.5' : ''">
      <div
        v-if="title || time || $slots.title || $slots.time"
        class="flex flex-wrap items-center justify-between gap-x-3"
      >
        <p v-if="title || $slots.title" class="text-foreground font-medium">
          <slot name="title">{{ title }}</slot>
        </p>
        <span v-if="time || $slots.time" class="text-default-400 text-xs">
          <slot name="time">{{ time }}</slot>
        </span>
      </div>
      <div v-if="$slots.default" class="text-default-600 mt-1 text-sm">
        <slot />
      </div>
    </div>
  </li>
</template>
