import { type VNode, Comment, Text } from 'vue'

// Recursively pull the rendered text out of a slot's VNode tree — used by
// Button to derive a sensible default aria-label from its slot content.
// Vue-specific (operates on VNodes), so it lives in the Vue layer rather
// than @kun/core.
export const extractTextFromVNodes = (nodes: VNode[]): string => {
  let text = ''
  for (const node of nodes) {
    if (node.type === Text) {
      text += node.children
    } else if (node.type === Comment) {
      continue
    } else if (Array.isArray(node.children)) {
      text += extractTextFromVNodes(node.children as VNode[])
    }
  }
  return text
}
