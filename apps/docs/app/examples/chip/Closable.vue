<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['Vue', 'React', 'Solid', 'Svelte'])

const remove = (tag: string) => {
  tags.value = tags.value.filter((t) => t !== tag)
}
</script>

<template>
  <KunChip
    v-for="tag in tags"
    :key="tag"
    color="primary"
    :closable="true"
    @close="remove(tag)"
  >
    {{ tag }}
  </KunChip>
  <KunChip v-if="tags.length === 0" color="default">已全部移除</KunChip>
</template>
