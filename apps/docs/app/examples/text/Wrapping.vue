<script setup lang="ts">
// KunText 在每个 `_` 和 `/` 后插入零宽空格,因此 URL / snake_case 这类长
// 标记会自动换行,而不会撑破容器。对比下方原生 <span>(会溢出)。
const long =
  'https://example.com/a/very/long/path_with_many_underscores_and_slashes_that_would_overflow'
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="rounded-kun-md border-default-200 w-48 border p-2">
      <KunText :content="long" class-name="text-sm" />
    </div>
    <div class="rounded-kun-md border-default-200 w-48 overflow-hidden border p-2">
      <span class="text-default-400 text-sm">{{ long }}</span>
    </div>
  </div>
</template>
