<script setup lang="ts">
// 仅展示已注册的图标(@kungal/ui-core 内置 + 本站 plugins/icons.ts 注册)。
// 未注册的名称会渲染为空,请勿使用。
const icons = [
  'lucide:check',
  'lucide:x',
  'lucide:info',
  'lucide:search',
  'lucide:copy',
  'lucide:download',
  'lucide:upload',
  'lucide:calendar',
  'lucide:eye',
  'lucide:eye-off',
  'lucide:arrow-right',
  'lucide:chevron-right',
  'lucide:plus',
  'lucide:minus',
  'lucide:external-link',
  'lucide:refresh-ccw',
  'lucide:home',
  'lucide:settings',
  'lucide:github',
  'lucide:bot',
  'lucide:zap',
  'lucide:palette',
  'lucide:moon',
  'svg-spinners:90-ring-with-bg',
]
</script>

<template>
  <div class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
    <div
      v-for="name in icons"
      :key="name"
      class="rounded-kun-md border-default-200 flex flex-col items-center gap-2 border p-3"
    >
      <KunIcon :name="name" class="text-2xl" />
      <span class="text-default-400 break-all text-center text-xs">{{ name }}</span>
    </div>
  </div>
</template>
