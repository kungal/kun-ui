import {
  computed,
  ref,
  toValue,
  type CSSProperties,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import {
  useFloating,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  size as sizeMiddleware,
  arrow as arrowMiddleware,
  type Middleware,
  type Placement,
  type ReferenceElement,
} from '@floating-ui/vue'
import { useTransformOrigin } from './useTransformOrigin'

// One floating-ui setup for every KunUI overlay (Popover / Tooltip / Dropdown /
// Select / Autocomplete). They all want the same recipe — offset + flip + shift,
// re-position while mounted, top/left positioning so a scale transition doesn't
// fight a translate, and a placement-aware transform-origin — so it lives here
// instead of being re-wired (and drifting) in every component.
//
// `transform: false` by default: components animate enter/leave with `scale-*`
// classes and floating-ui's translate3d on the same element would fight them.
// Pass `transform: true` for opacity-only overlays (e.g. plain tooltips).

export interface UseKunFloatingOptions {
  placement?: MaybeRefOrGetter<Placement>
  open?: Ref<boolean>
  offset?: number
  padding?: number
  // Render a caret pointing at the reference. Bind the returned `arrowRef` to a
  // square element and `arrowStyles` to its style; the static side is offset so
  // it sits half outside the panel edge.
  arrow?: boolean
  arrowPadding?: number
  transform?: boolean
  // Keep the panel inside the viewport with flip() + shift(). Default true.
  // Pass false to respect the literal `placement` verbatim (Popover's
  // autoPosition=false).
  constrain?: boolean
  // Cap the panel to the space the viewport actually offers (size() middleware):
  // sets max-height / max-width to the available room and makes it scroll, so a
  // tall menu near the bottom edge (or a wide one on a narrow screen) stays fully
  // on-screen instead of overflowing. For menus that DON'T need to match the
  // trigger width (Popover / Dropdown); Select / Autocomplete pass their own
  // size() via `middleware` instead.
  maxSize?: boolean
  // Extra middleware appended after shift() — e.g. size() to match the trigger
  // width (Select / Autocomplete).
  middleware?: Middleware[]
}

const OPPOSITE_SIDE: Record<string, 'top' | 'right' | 'bottom' | 'left'> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

export const useKunFloating = (
  reference: Ref<ReferenceElement | null>,
  floating: Ref<HTMLElement | null>,
  options: UseKunFloatingOptions = {}
) => {
  const arrowRef = ref<HTMLElement | null>(null)

  const constrain = options.constrain ?? true
  const padding = options.padding ?? 8
  const middleware: Middleware[] = [
    offsetMiddleware(options.offset ?? 8),
    ...(constrain ? [flip(), shift({ padding })] : []),
    // size() runs after flip so it measures the room on the RESOLVED side.
    ...(options.maxSize
      ? [
          sizeMiddleware({
            padding,
            apply({ availableWidth, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                maxWidth: `${Math.max(0, Math.floor(availableWidth))}px`,
                maxHeight: `${Math.max(0, Math.floor(availableHeight))}px`,
                overflowY: 'auto',
              })
            },
          }),
        ]
      : []),
    ...(options.middleware ?? []),
    ...(options.arrow
      ? [arrowMiddleware({ element: arrowRef, padding: options.arrowPadding ?? 6 })]
      : []),
  ]

  const { floatingStyles, placement, middlewareData } = useFloating(
    reference,
    floating,
    {
      placement: computed(() => toValue(options.placement) ?? 'bottom'),
      open: options.open,
      whileElementsMounted: autoUpdate,
      transform: options.transform ?? false,
      middleware,
    }
  )

  const transformOrigin = useTransformOrigin(placement)

  // Position the caret on the side facing the reference, centered by floating-ui
  // along the cross axis, and pulled half its size outside the panel edge.
  const arrowStyles = computed<CSSProperties>(() => {
    const data = middlewareData.value.arrow
    const side = placement.value.split('-')[0] ?? 'bottom'
    const staticSide = OPPOSITE_SIDE[side] ?? 'bottom'
    return {
      position: 'absolute',
      left: data?.x != null ? `${data.x}px` : '',
      top: data?.y != null ? `${data.y}px` : '',
      [staticSide]: 'calc(var(--kun-arrow-size, 0.5rem) / -2)',
    }
  })

  return {
    floatingStyles,
    placement,
    transformOrigin,
    arrowRef,
    arrowStyles,
    middlewareData,
  }
}
