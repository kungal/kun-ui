<script setup lang="ts">
// Rows come from app/generated/component-meta.json (produced by `pnpm gen:meta`
// from the TypeScript prop interfaces) — no hand-maintained, drift-prone tables.
interface PropRow {
  name: string
  type: string
  required?: boolean
  default?: string
  description?: string
}
defineProps<{ rows: PropRow[] }>()
</script>

<template>
  <div class="border-default-200 rounded-kun-lg my-5 overflow-x-auto border">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-default-200 text-default-500 border-b text-left">
          <th class="px-4 py-2 font-medium">Prop</th>
          <th class="px-4 py-2 font-medium">Type</th>
          <th class="px-4 py-2 font-medium">Default</th>
          <th class="px-4 py-2 font-medium">Description</th>
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
            <span v-if="r.required" class="text-danger" title="required">&nbsp;*</span>
          </td>
          <td class="text-default-600 px-4 py-2 font-mono">{{ r.type }}</td>
          <td class="text-default-500 px-4 py-2 font-mono whitespace-nowrap">
            {{ r.default ?? '—' }}
          </td>
          <td class="text-default-600 px-4 py-2">{{ r.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
