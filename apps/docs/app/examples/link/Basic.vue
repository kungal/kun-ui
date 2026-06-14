<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunLink href="/components/button">内部链接</KunLink>
    <KunLink href="#" underline="hover">悬停显示下划线</KunLink>
    <KunLink href="#" :underline="'none'">无下划线</KunLink>
  </div>
</template>
