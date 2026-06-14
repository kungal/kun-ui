<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="w-40">
      <KunUpload :size="200" :aspect="1" description="正方形 1:1" />
    </div>
    <div class="w-56">
      <KunUpload :size="400" :aspect="16 / 9" description="宽幅 16:9" />
    </div>
  </div>
</template>
