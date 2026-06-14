<template>
  <!-- 默认带边框。 -->
  <KunCard class-name="w-40">
    <span class="font-medium">bordered</span>
    <span class="text-default-500 text-sm">默认带边框</span>
  </KunCard>

  <!-- bordered=false：去掉边框。 -->
  <KunCard :bordered="false" color="default" class-name="w-40">
    <span class="font-medium">无边框</span>
    <span class="text-default-500 text-sm">bordered=false</span>
  </KunCard>

  <!-- is-transparent：透明背景、无毛玻璃模糊。 -->
  <KunCard is-transparent class-name="w-40">
    <span class="font-medium">透明</span>
    <span class="text-default-500 text-sm">is-transparent</span>
  </KunCard>
</template>
