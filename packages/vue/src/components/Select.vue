<script setup lang="ts" generic="T extends KunSelectValue = KunSelectValue">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/vue'
import { cn, kunRoundedClasses, kunControlSizeClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useTransformOrigin } from '../composables/useTransformOrigin'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type { KunSelectProps, KunSelectValue } from './types'

defineOptions({ name: 'KunSelect' })

const props = withDefaults(defineProps<KunSelectProps<T>>(), {
  placeholder: '',
  label: '',
  disabled: false,
  error: '',
  darkBorder: true,
  ariaLabel: '',
  className: '',
  rounded: undefined,
  size: 'md',
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const modelValue = defineModel<T>({ required: true })

const emit = defineEmits<{
  set: [value: T, index: number]
}>()

const kunUniqueId = useKunUniqueId('kun-select')
const isOpen = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const { floatingStyles, placement } = useFloating(buttonRef, dropdownRef, {
  placement: 'bottom-start',
  open: isOpen,
  whileElementsMounted: autoUpdate,
  // top/left positioning so the Transition's transform classes don't fight
  // floating-ui's translate3d.
  transform: false,
  middleware: [
    offset(4),
    flip(),
    shift({ padding: 8 }),
    // Match dropdown width to the trigger; cap height to viewport so the
    // list scrolls instead of overflowing.
    size({
      apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${Math.min(240, availableHeight - 8)}px`,
        })
      },
    }),
  ],
})
// Grow the listbox out of the trigger edge (post-flip aware).
const transformOrigin = useTransformOrigin(placement)

onClickOutside(buttonRef, (event) => {
  if (dropdownRef.value?.contains(event.target as Node)) return
  isOpen.value = false
})

const selectedLabel = computed(
  () => props.options.find((option) => option.value === modelValue.value)?.label
)

const toggle = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const selectOption = (value: T, index: number) => {
  modelValue.value = value
  emit('set', value, index)
  isOpen.value = false
}
</script>

<template>
  <div :class="cn('relative w-full', props.className)">
    <label v-if="label" :for="kunUniqueId" class="mb-2 block text-sm font-medium">
      {{ label }}
    </label>

    <button
      ref="buttonRef"
      :id="kunUniqueId"
      type="button"
      :aria-label="props.ariaLabel || 'select'"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :class="
        cn(
          'focus:border-primary focus:ring-primary flex w-full cursor-pointer items-center justify-between text-left focus:ring-1 focus:outline-none',
          kunControlSizeClasses[props.size],
          roundedClass,
          darkBorder && 'dark:border-default-200 border-default/20 border',
          disabled && 'bg-default-100 cursor-not-allowed'
        )
      "
      :disabled="disabled"
      @click="toggle"
    >
      <span class="block min-w-0 flex-1 truncate">
        {{ selectedLabel || placeholder }}
      </span>
      <KunIcon
        name="lucide:chevron-down"
        class="pointer-events-none shrink-0"
        :class="cn('text-inherit transition-transform', isOpen ? 'rotate-180' : '')"
      />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-kun-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-kun-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          :style="[floatingStyles, { transformOrigin }]"
          :class="
            cn(
              'bg-content1 border-default-200 z-kun-popover flex flex-col overflow-hidden border p-1 shadow-lg',
              roundedClass
            )
          "
        >
          <ul
            class="scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-kun-sm text-sm focus:outline-none"
            tabindex="-1"
            role="listbox"
          >
            <li
              v-for="(option, index) in options"
              :key="option.value"
              class="hover:bg-default-100 text-foreground relative flex cursor-pointer items-center justify-between rounded-kun-md px-3 py-2 select-none"
              role="option"
              :aria-selected="modelValue === option.value"
              @click="selectOption(option.value, index)"
            >
              <span class="block min-w-0 flex-1 truncate">{{ option.label }}</span>
              <KunIcon
                v-if="modelValue === option.value"
                name="lucide:check"
                class="ml-2 shrink-0"
              />
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>

    <p v-if="error" class="text-danger mt-2 text-sm">{{ error }}</p>
  </div>
</template>
