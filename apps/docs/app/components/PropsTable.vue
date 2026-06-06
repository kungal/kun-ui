<script setup lang="ts">
// Hand-fed for now. Follow-up: auto-generate these rows from the component's
// TypeScript prop interface (vue-component-meta) so they never drift.
interface PropRow {
  name: string
  type: string
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
          class="border-default-100 align-top last:border-0 [&:not(:last-child)]:border-b"
        >
          <td class="text-primary px-4 py-2 font-mono whitespace-nowrap">{{ r.name }}</td>
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
