<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)
</script>

<template>
  <div class="max-w-md">
    <!-- 默认插槽暴露 pick / disabled / fileName，可完全自定义触发器 -->
    <KunFileInput v-model="file" :show-file-name="false">
      <template #default="{ pick, fileName }">
        <KunButton variant="bordered" color="success" @click="pick">
          <KunIcon name="lucide:image-plus" class="mr-1 size-4" />
          {{ fileName || '点击选择图片' }}
        </KunButton>
      </template>
    </KunFileInput>
  </div>
</template>
