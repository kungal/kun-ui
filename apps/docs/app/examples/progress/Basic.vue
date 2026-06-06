<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <KunProgress :value="60" show-label />
    <KunProgress :value="40" variant="striped" color="success" />
    <KunProgress :value="80" variant="gradient" color="secondary" />
    <KunProgress indeterminate color="primary" />
  </div>
</template>
