<template>
  <!-- start 插槽：在文本前放一个状态圆点。 -->
  <KunChip color="success">
    <template #start>
      <span class="bg-success size-2 rounded-full" />
    </template>
    在线
  </KunChip>

  <KunChip color="warning">
    <template #start>
      <span class="bg-warning size-2 rounded-full" />
    </template>
    离开
  </KunChip>

  <!-- start 插槽：图标。 -->
  <KunChip color="primary" variant="bordered">
    <template #start>
      <KunIcon name="lucide:circle-check" class="size-3.5" />
    </template>
    已完成
  </KunChip>

  <!-- end 插槽：尾部图标。 -->
  <KunChip color="secondary" variant="flat">
    精选
    <template #end>
      <KunIcon name="lucide:zap" class="size-3.5" />
    </template>
  </KunChip>
</template>
