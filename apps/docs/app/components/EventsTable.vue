<script setup lang="ts">
import { computed } from 'vue'

// Rows come from app/generated/component-meta.json (`pnpm gen:meta` reads the
// SFC's `defineEmits` type), like PropsTable. Unlike PropsTable this renders its
// own heading and disappears entirely when a component emits nothing, so a page
// can carry the tag unconditionally and never drift as events are added.
interface EventRow {
  name: string
  type: string
  description?: string
}
const props = defineProps<{ rows: EventRow[] }>()

// Same rule gen-page-md applies to the Markdown: an all-empty 说明 column is
// pure noise, and most of these are still undocumented.
const described = computed(() => props.rows.some((r) => r.description))
</script>

<template>
  <template v-if="rows.length">
    <h2 class="mt-8 mb-1 text-xl font-semibold">事件</h2>
    <div class="border-default-200 rounded-kun-lg my-5 overflow-x-auto border">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-default-200 text-default-500 border-b text-left">
            <th class="px-4 py-2 font-medium">事件</th>
            <th class="px-4 py-2 font-medium">回调参数</th>
            <th v-if="described" class="px-4 py-2 font-medium">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in rows"
            :key="r.name"
            class="border-default-100 align-top [&:not(:last-child)]:border-b"
          >
            <td class="px-4 py-2 font-mono whitespace-nowrap">
              <span class="text-primary">{{ r.name }}</span>
            </td>
            <td class="text-default-600 px-4 py-2 font-mono">{{ r.type || '—' }}</td>
            <td v-if="described" class="text-default-600 px-4 py-2">{{ r.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
