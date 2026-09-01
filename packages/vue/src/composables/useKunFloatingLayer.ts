// Registry of the open floating panels — Popover, Dropdown, Select,
// Autocomplete, DatePicker, ContextMenu, CommandPalette. Every one of them
// <Teleport>s its panel to <body>, which puts the panel OUTSIDE the DOM subtree
// KunModal / KunDrawer build their focus trap and their Escape handling from.
// Two separate bugs came out of that blind spot, both measured in Chrome 151
// against apps/playground:
//
//   - focus-trap's `checkFocusIn` reads a click into the teleported panel as
//     "focus escaped" and pulls focus straight back to the trigger. A link
//     Popover inside a KunModal could not be focused OR typed into at all:
//     after typing "example.com" into it `input.value` was still "" and
//     `document.activeElement` was the trigger BUTTON. A searchable KunSelect
//     inside a KunModal failed the same way.
//   - One Escape closed the popover AND the modal under it, because the
//     popup's handler and the modal's window handler are both live and neither
//     knows about the other.
//
// Registering the panel here fixes both. Modal/Drawer add the panels they own
// to their trap's container list (focus-trap's `updateContainerElements`,
// reached by handing useFocusTrap an array), and stand their Escape handler
// down while one of them is open — the same shape as the existing
// `isWatchingCloseRequests` gate.
//
// Ownership is decided by the TRIGGER, not the panel: the panel is teleported
// and so is inside nobody, but the trigger sits in the normal tree, so
// `trapEl.contains(trigger)` answers "was this popup opened from inside this
// modal". Without that test an unrelated popover left open elsewhere on the
// page would become tabbable from inside the modal (its panel is
// `data-kun-overlay`, so useKunBackgroundInert does not inert it) and would
// swallow the modal's Escape. A layer with no trigger element (KunCommandPalette
// opened by its ⌘K shortcut) is owned by every trap, which is what makes it
// usable on top of an open modal.
//
// Modal and Drawer deliberately do NOT register: a nested modal runs its own
// trap and must stay isolated from the one below it.
//
// Prior art for the focus half: Radix's FocusScope grew a `branches` prop for
// exactly this case (radix-ui/primitives#3423, "portalled content of a nested,
// non-modal layer"), and Reka UI shipped it as the fix for #2749, "a Combobox
// input inside a Dialog could not be focused". Radix's branches only widen the
// focus-retention check; focus-trap has no equivalent, so ours widen the tab
// order too. That is benign here because every panel we register either
// contributes one roving-tabindex stop (Dropdown / ContextMenu / DatePicker) or
// its own genuinely tabbable controls (a Popover's input, a Select's search
// box), which is where Tab should go anyway.

import {
  computed,
  onScopeDispose,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'

type KunFloatingLayer = {
  panel: HTMLElement
  trigger: HTMLElement | null
}

// shallowRef + whole-array replacement: the entries hold DOM nodes, and a deep
// `ref` would walk them on every write.
const layers = shallowRef<KunFloatingLayer[]>([])

type MaybeElementRef = Ref<HTMLElement | null | undefined>

/**
 * Declare that this component owns a teleported floating panel, so an enclosing
 * KunModal / KunDrawer stops treating the panel as "outside".
 *
 * `panel` is the teleported element and `trigger` the element inside the normal
 * tree that opens it — omit `trigger` only for a layer with no anchor.
 */
export const useKunFloatingLayer = (
  panel: MaybeElementRef,
  options: { trigger?: MaybeElementRef } = {}
) => {
  let registered: HTMLElement | null = null
  let detachTimer: ReturnType<typeof setTimeout> | null = null

  const cancelDetach = () => {
    if (detachTimer === null) return
    clearTimeout(detachTimer)
    detachTimer = null
  }

  const detach = () => {
    cancelDetach()
    if (!registered) return
    const el = registered
    registered = null
    layers.value = layers.value.filter((layer) => layer.panel !== el)
  }

  watch(panel, (el) => {
    if (el) {
      detach()
      registered = el
      layers.value = [
        ...layers.value,
        { panel: el, trigger: options.trigger?.value ?? null },
      ]
      return
    }
    // Deregistering has to wait out the key press that caused it. Vue clears a
    // template ref when the vnode unmounts, and for a <Transition> that is the
    // START of the leave, not the end — so closing a popover with Escape nulls
    // this ref while that same keydown is still bubbling. The scheduler then
    // flushes in the microtask checkpoint BETWEEN two window listeners, so a
    // synchronous detach here empties the registry before the modal's listener
    // reads it, and the modal closes along with the popover. Measured exactly
    // that. A macrotask lands after the whole dispatch instead.
    cancelDetach()
    detachTimer = setTimeout(detach, 0)
  })

  onScopeDispose(detach)
}

/**
 * The floating panels a focus trap rooted at `container` owns — see
 * useKunFloatingLayer. `panels` goes into the trap's container list and
 * `hasOpenLayer` gates the Escape handler.
 */
export const useKunFloatingLayerStack = (
  container: MaybeElementRef
): {
  panels: ComputedRef<HTMLElement[]>
  hasOpenLayer: ComputedRef<boolean>
} => {
  const owned = computed(() => {
    const root = container.value
    if (!root) return []
    return layers.value.filter(
      (layer) => !layer.trigger || root.contains(layer.trigger)
    )
  })

  return {
    panels: computed(() => owned.value.map((layer) => layer.panel)),
    hasOpenLayer: computed(() => owned.value.length > 0),
  }
}
