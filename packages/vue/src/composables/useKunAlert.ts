import { ref } from 'vue'

// Promise-based confirm dialog. Same store + mounted-provider pattern as the
// message system — NO imperative render() / stolen Nuxt appContext. Mount
// <KunAlertProvider/> once near your app root, then `await useKunAlert(...)`.

export interface KunAlertOptions {
  title?: string
  message?: string
  showCancel?: boolean
}

interface KunAlertState {
  show: boolean
  title: string
  message: string
  showCancel: boolean
}

const state = ref<KunAlertState>({
  show: false,
  title: '',
  message: '',
  showCancel: true,
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
  return new Promise((resolve) => {
    resolver = resolve
    state.value = {
      show: true,
      title: opts.title ?? '',
      message: opts.message ?? '',
      showCancel: opts.showCancel ?? true,
    }
  })
}
