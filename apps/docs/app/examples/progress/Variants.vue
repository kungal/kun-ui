<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <!-- solid（默认）、striped 条纹、gradient 渐变 -->
    <KunProgress :value="65" variant="solid" color="primary" />
    <KunProgress :value="65" variant="striped" color="success" />
    <KunProgress :value="65" variant="gradient" color="secondary" />
  </div>
</template>
