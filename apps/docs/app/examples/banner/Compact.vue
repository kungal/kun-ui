<script setup lang="ts">
const sizes = ['md', 'sm'] as const
</script>

<template>
  <div class="w-full space-y-4">
    <figure v-for="size in sizes" :key="size" class="space-y-2">
      <figcaption class="text-default-500 text-xs">
        size="{{ size }}"{{ size === 'md' ? '(默认)' : '' }}
      </figcaption>
      <div class="border-default-200 bg-background overflow-hidden rounded-lg border">
        <KunBanner
          :size="size"
          color="danger"
          variant="flat"
          icon="lucide:eye-off"
          :closable="false"
          text="当前为全年龄模式,R18 内容已隐藏 — 可在右上角切换为「模糊」或「直接显示」。"
        />
        <header class="border-default-200 flex items-center justify-between border-b px-4 py-3">
          <span class="font-bold">Kun<span class="text-primary">Gal</span></span>
          <nav class="text-default-500 flex gap-4 text-sm">
            <span>话题</span><span>Galgame</span>
          </nav>
        </header>
        <p class="text-default-600 p-4 text-sm">横幅一直显示时,在窄屏上用 sm 少占一截高度。</p>
      </div>
    </figure>
  </div>
</template>
