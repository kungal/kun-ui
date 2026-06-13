<script setup lang="ts">
import { computed } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'
import { useKunAlertState } from '../composables/useKunAlert'
import KunButton from './Button.vue'
import KunModal from './Modal.vue'

// The single mounted host for useKunAlert() confirm dialogs. Mount once near
// your app root: <KunAlertProvider />. Replaces the original's imperative
// render() + stolen Nuxt appContext.
defineOptions({ name: 'KunAlertProvider' })

const { state, handleConfirm, handleCancel } = useKunAlertState()

// Emphasize the confirm (primary action); the cancel stays neutral. `danger`
// confirms (delete, etc.) go red — the conventional destructive coloring.
const confirmColor = computed<KunUIColor>(() => {
  if (state.value.confirmColor) return state.value.confirmColor
  if (state.value.type === 'danger') return 'danger'
  if (state.value.type === 'warning') return 'warning'
  return 'primary'
})
</script>

<template>
  <KunModal
    :model-value="state.show"
    role="alertdialog"
    :aria-label="state.title || '确认'"
    class-name="z-kun-alert fixed"
    @update:model-value="(value: boolean) => !value && handleCancel()"
  >
    <div class="max-w-80">
      <div class="space-y-2">
        <h3 v-if="state.title" class="text-lg font-semibold">{{ state.title }}</h3>
        <p v-if="state.message" class="text-default-600 text-sm">{{ state.message }}</p>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <KunButton
          v-if="state.showCancel"
          variant="light"
          color="default"
          @click="handleCancel"
        >
          {{ state.cancelText }}
        </KunButton>
        <KunButton :color="confirmColor" @click="handleConfirm">
          {{ state.confirmText }}
        </KunButton>
      </div>
    </div>
  </KunModal>
</template>
