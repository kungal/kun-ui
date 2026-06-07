<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getRandomLoli } from '../utils/loliAssets'
import KunImage from './Image.vue'
import KunIcon from './Icon.vue'
import type { KunLoliProps } from './types'

// The loli mascot popup. Usually rendered by <KunLoliProvider> driven by
// useKunLoliInfo, but usable standalone. Picks a random mascot per mount;
// the image lives at /alert/{name}.webp in the consuming app's public dir.
// Animation classes (animate-fadeInUp/swing/etc.) come from @kungal/ui-tokens.
defineOptions({ name: 'KunLoli' })

const props = defineProps<KunLoliProps>()

const { loli, name } = getRandomLoli()

const isVisible = ref(false)
const progress = ref(100)
let animationFrame: number | null = null

const close = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  isVisible.value = false
}

onMounted(() => {
  isVisible.value = true
  const startTime = performance.now()
  const duration = props.duration

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
    progress.value = remaining
    if (remaining > 0) {
      animationFrame = requestAnimationFrame(animate)
    } else {
      close()
    }
  }
  animationFrame = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <Transition enter-active-class="animate-fadeInUp" leave-active-class="animate-fadeOutDown">
    <div
      v-if="isVisible"
      class="bg-background z-kun-message fixed right-0 bottom-0 left-0 min-h-30 w-full border-t"
    >
      <Transition enter-active-class="animate-swing" appear>
        <div class="loli absolute -top-10 pl-24 text-lg sm:pl-32">
          <span class="bg-background px-10 py-1 text-center text-lg sm:text-2xl">
            {{ name }}
          </span>
        </div>
      </Transition>

      <div class="pointer-events-none absolute mt-2 ml-6 select-none">
        <KunImage class="h-16 w-full sm:h-24" :src="loli" />
      </div>

      <Transition enter-active-class="animate-bounceInRight" appear>
        <!-- inspired by しゅがてん！-Sugarfull tempering- -->
        <div class="info mt-4 mr-8 ml-24 text-base sm:ml-32 sm:text-lg">
          {{ `「 ${message} 」` }}
        </div>
      </Transition>

      <button
        class="hover:bg-default/40 absolute top-1 right-1 inline-flex cursor-pointer overflow-hidden rounded-full border-transparent bg-transparent p-2 text-sm font-medium transition-all hover:opacity-80 active:scale-[0.97]"
        @click="close"
      >
        <KunIcon name="lucide:x" class="h-4 w-4" />
      </button>

      <span :style="{ width: `${progress}%` }" class="bg-primary absolute top-0 right-0 h-1.5" />
    </div>
  </Transition>
</template>

<style scoped>
.loli {
  filter: drop-shadow(2px 4px 3px var(--color-primary-300));

  span {
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  }
}

.info {
  color: var(--color-white);
  text-shadow:
    0 1px var(--color-foreground),
    1px 0 var(--color-foreground),
    -1px 0 var(--color-foreground),
    0 -1px var(--color-foreground),
    1px 2px var(--color-foreground);
}
</style>
