import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// Promise-based confirm dialog. Same store + mounted-provider pattern as the
// message system — NO imperative render() / stolen Nuxt appContext. Mount
// <KunAlertProvider/> once near your app root, then `await useKunAlert(...)`.

// 'danger' for destructive confirms (delete, etc.) — colors the confirm button
// red; 'warning' yellow; 'info' (default) the primary color.
export type KunAlertType = 'info' | 'warning' | 'danger'

export interface KunAlertOptions {
  title?: string
  message?: string
  showCancel?: boolean
  // Confirm/cancel button labels (default 确定 / 取消).
  confirmText?: string
  cancelText?: string
  // Intent of the confirm action — drives the confirm button color.
  type?: KunAlertType
  // Override the confirm button color directly (wins over `type`).
  confirmColor?: KunUIColor
}

interface KunAlertState extends Required<Omit<KunAlertOptions, 'confirmColor'>> {
  show: boolean
  confirmColor?: KunUIColor
}

const state = ref<KunAlertState>({
  show: false,
  title: '',
  message: '',
  showCancel: true,
  confirmText: '确定',
  cancelText: '取消',
  type: 'info',
  confirmColor: undefined,
})

let resolver: ((ok: boolean) => void) | null = null

// Read side — consumed by <KunAlertProvider>.
export const useKunAlertState = () => ({
  state,
  handleConfirm: () => {
    state.value.show = false
    resolver?.(true)
    resolver = null
  },
  handleCancel: () => {
    state.value.show = false
    resolver?.(false)
    resolver = null
  },
})

// Trigger — resolves true (confirm) / false (cancel or dismiss).
export const useKunAlert = (opts: KunAlertOptions = {}): Promise<boolean> => {
  // A second alert before the first resolves: reject the stale one as cancelled.
  resolver?.(false)
  return new Promise((resolve) => {
    resolver = resolve
    state.value = {
      show: true,
      title: opts.title ?? '',
      message: opts.message ?? '',
      showCancel: opts.showCancel ?? true,
      confirmText: opts.confirmText ?? '确定',
      cancelText: opts.cancelText ?? '取消',
      type: opts.type ?? 'info',
      confirmColor: opts.confirmColor,
    }
  })
}
