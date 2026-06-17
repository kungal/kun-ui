<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@kungal/ui-core'
import { KUN_ACCORDION } from '../composables/accordionContext'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type { KunAccordionItemProps } from './types'

// One collapsible section. Must live inside <KunAccordion> (it reads its open
// state + toggle from context). The reveal uses the grid `0fr → 1fr` trick:
// pure CSS, animates real height with no JS measurement, and renders correctly
// server-side (closed = collapsed in the SSR HTML, no hydration flash).
defineOptions({ name: 'KunAccordionItem' })

const props = withDefaults(defineProps<KunAccordionItemProps>(), {
  title: '',
  icon: '',
  disabled: false,
  name: undefined,
  className: '',
})

const ctx = inject(KUN_ACCORDION, null)

const open = computed(() => ctx?.isOpen(props.value) ?? false)
const splitted = computed(() => ctx?.variant.value === 'splitted')

// SSR-stable, globally-unique ids (Vue useId) so two accordions that happen to
// reuse the same item `value`s never collide. `name` is an optional readable
// prefix. (Item state still keys off `value`; only the DOM ids use the uid.)
const uid = useKunUniqueId(props.name ? `${props.name}-acc-` : 'kun-acc-')
const headerId = computed(() => `${uid.value}-header`)
const panelId = computed(() => `${uid.value}-panel`)

const onToggle = () => {
  if (props.disabled) return
  ctx?.toggle(props.value)
}
</script>

<template>
  <div :class="cn(splitted && 'border-kun rounded-kun-lg overflow-hidden border', className)">
    <h3>
      <button
        :id="headerId"
        type="button"
        :aria-expanded="open"
        :aria-controls="panelId"
        :disabled="disabled"
        :class="
          cn(
            'flex w-full items-center gap-3 px-4 py-4 text-left font-medium transition-colors',
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-default/5 cursor-pointer'
          )
        "
        @click="onToggle"
      >
        <span v-if="icon" class="text-default-500 inline-flex shrink-0">
          <KunIcon :name="icon" class="size-5" />
        </span>
        <span class="min-w-0 flex-1">
          <slot name="title">{{ title }}</slot>
        </span>
        <KunIcon
          name="lucide:chevron-down"
          :class="
            cn(
              'text-default-500 size-5 shrink-0 transition-transform duration-kun-base',
              open && 'rotate-180'
            )
          "
        />
      </button>
    </h3>

    <!-- grid 0fr ↔ 1fr animates the real content height (SSR-safe, no measure) -->
    <div
      :id="panelId"
      role="region"
      :aria-labelledby="headerId"
      :inert="!open"
      :class="
        cn(
          'grid transition-[grid-template-rows] duration-kun-base ease-kun-standard',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )
      "
    >
      <div class="overflow-hidden">
        <div class="text-default-600 px-4 pb-4 text-sm">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
