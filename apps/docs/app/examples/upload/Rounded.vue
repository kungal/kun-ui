<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="w-40">
      <KunUpload :size="200" :aspect="1" rounded="full" description="圆形头像" />
    </div>
    <div class="w-40">
      <KunUpload
        :size="200"
        :aspect="1"
        rounded="lg"
        initial-image="https://avatars.githubusercontent.com/u/106518268"
        description="带默认图片"
      />
    </div>
  </div>
</template>
