<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { id: 1, label: '项目 A', checked: true },
  { id: 2, label: '项目 B', checked: false },
  { id: 3, label: '项目 C', checked: false },
])

const allChecked = () => items.value.every((i) => i.checked)
const someChecked = () => items.value.some((i) => i.checked) && !allChecked()
const toggleAll = (v: boolean) => items.value.forEach((i) => (i.checked = v))
</script>

<template>
  <div class="max-w-xs">
    <KunCheckBox
      :model-value="allChecked()"
      :indeterminate="someChecked()"
      color="primary"
      label="全选"
      @change="toggleAll"
    />
    <div class="mt-2 ml-6 flex flex-col gap-1">
      <KunCheckBox
        v-for="item in items"
        :key="item.id"
        v-model="item.checked"
        color="primary"
        :label="item.label"
      />
    </div>
  </div>
</template>
