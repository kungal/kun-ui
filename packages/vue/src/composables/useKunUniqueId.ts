import { ref, useId, type Ref } from 'vue'

// Stable unique id for label/input `for`/`id` pairing. Vue's `useId()` is
// guaranteed identical across server and client renders (since 3.4), so we call
// it synchronously in setup — NOT deferred to onMounted. Deferring would leave
// the server HTML with empty ids (breaking `<label for>` associations and
// causing a hydration mismatch when the id appears on the client).
export const useKunUniqueId = (prefix?: string): Ref<string> =>
  ref(`${prefix ?? ''}${useId()}`)
