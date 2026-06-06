import { onMounted, ref, useId } from 'vue'

// Stable unique id for label/input `for`/`id` pairing. Deferred to onMounted
// (matches the original): SSR renders an empty id, the client fills it after
// mount, avoiding any server/client id divergence. `useId` is Vue 3.5 native.
export const useKunUniqueId = (id?: string) => {
  const kunId = ref(id || '')
  onMounted(() => {
    kunId.value = `${id ?? ''}${useId()}`
  })
  return kunId
}
