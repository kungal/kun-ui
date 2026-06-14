<template>
  <div class="flex flex-wrap items-center gap-6">
    <KunProgress :value="25" variant="circle" color="primary" show-label aria-label="进度 25%" />
    <KunProgress :value="60" variant="circle" color="success" show-label aria-label="进度 60%" />
    <KunProgress :value="90" variant="circle" color="warning" show-label aria-label="进度 90%" />
  </div>
</template>
