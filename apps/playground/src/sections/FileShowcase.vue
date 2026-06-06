<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const files = ref<File[]>([])
const tags = ref<string[]>(['vue', 'react', 'solid'])
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">FileInput · TagInput · Upload</h2>

    <div class="flex flex-wrap items-center gap-4">
      <KunFileInput v-model="file" hint="Single file" />
      <KunFileInput
        v-model:files="files"
        :multiple="true"
        trigger-text="选择多个文件"
        trigger-color="secondary"
      />
    </div>

    <KunTagInput
      v-model="tags"
      label="Tags"
      placeholder="Type and press Enter"
      :show-counter="true"
      :max-tags="8"
      class-name="max-w-md"
    />

    <h3 class="text-base font-medium">Upload (drag/drop + crop)</h3>
    <div class="w-48">
      <KunUpload :size="400" :aspect="1" hint="点击或拖拽上传" />
    </div>
  </section>
</template>
