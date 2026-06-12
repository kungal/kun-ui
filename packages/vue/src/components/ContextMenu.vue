<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunContextMenuItem, KunContextMenuProps } from './types'

// Right-click style menu positioned at an x/y point, clamped into the
// viewport. Controlled via `visible` + `position` props. (The original's
// Nuxt-only `import.meta.client` guard is replaced by a runtime
// `typeof window` check so the lib build is correct under any SSR host.)
defineOptions({ name: 'KunContextMenu' })

const props = withDefaults(defineProps<KunContextMenuProps>(), {
  items: () => [],
  position: () => ({ x: 0, y: 0 }),
  width: 192,
  padding: 12,
})

const emit = defineEmits<{
  (event: 'select', item: KunContextMenuItem): void
  (event: 'close'): void
}>()

const menuRef = ref<HTMLDivElement | null>(null)
const menuPosition = ref({
  x: props.position?.x ?? 0,
  y: props.position?.y ?? 0,
})

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(max, min))

const updateMenuPosition = async () => {
  if (!props.visible || typeof window === 'undefined') return

  await nextTick()

  const menuWidth = menuRef.value?.offsetWidth || props.width
  const menuHeight = menuRef.value?.offsetHeight || 60
  const padding = props.padding
  const rawX = props.position?.x ?? 0
  const rawY = props.position?.y ?? 0

  const maxX = window.innerWidth - menuWidth - padding
  const maxY = window.innerHeight - menuHeight - padding

  menuPosition.value = {
    x: clamp(rawX, padding, maxX),
    y: clamp(rawY, padding, maxY),
  }
}

watch(
  () => [props.visible, props.position?.x, props.position?.y],
  () => {
    if (props.visible) updateMenuPosition()
  },
  { immediate: true }
)

const closeMenu = () => emit('close')

const handlePointerDown = (event: Event) => {
  if (!props.visible) return
  const target = event.target as Node
  if (menuRef.value && !menuRef.value.contains(target)) closeMenu()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && event.key === 'Escape') closeMenu()
}

const handleScroll = () => {
  if (props.visible) closeMenu()
}

onMounted(() => {
  window.addEventListener('pointerdown', handlePointerDown, true)
  window.addEventListener('contextmenu', handlePointerDown, true)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handlePointerDown, true)
  window.removeEventListener('contextmenu', handlePointerDown, true)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

const menuStyle = computed(() => ({
  top: `${menuPosition.value.y}px`,
  left: `${menuPosition.value.x}px`,
  minWidth: `${props.width}px`,
  // grow out of the click point
  transformOrigin: 'top left',
}))

const handleSelect = (item: KunContextMenuItem) => {
  if (item.disabled) return
  emit('select', item)
  closeMenu()
}
</script>

<template>
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
        v-if="visible && items.length"
        ref="menuRef"
        class="border-default-200 bg-background/95 fixed z-kun-popover rounded-kun-lg border p-1 text-sm shadow-2xl backdrop-blur"
        :style="menuStyle"
        @click.stop
      >
        <KunButton
          v-for="item in items"
          :key="item.key"
          variant="light"
          :color="item.color || 'default'"
          size="sm"
          class-name="justify-start gap-2 w-full"
          :disabled="item.disabled"
          :href="item.href"
          @click.stop="handleSelect(item)"
        >
          <KunIcon v-if="item.icon" :name="item.icon" class="text-base" />
          <span>{{ item.label }}</span>
        </KunButton>
      </div>
    </Transition>
  </Teleport>
</template>
