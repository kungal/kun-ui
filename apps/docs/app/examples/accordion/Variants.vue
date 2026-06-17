<template>
  <div class="flex w-full max-w-lg flex-col gap-6">
    <KunAccordion variant="bordered" default-value="x">
      <KunAccordionItem value="x" title="Bordered 变体">外框 + 分隔线。</KunAccordionItem>
      <KunAccordionItem value="y" title="第二项">描边容器内分隔。</KunAccordionItem>
    </KunAccordion>
    <KunAccordion variant="splitted" default-value="x">
      <KunAccordionItem value="x" title="Splitted 变体">每个区块是独立卡片。</KunAccordionItem>
      <KunAccordionItem value="y" title="第二项">区块之间有间距。</KunAccordionItem>
    </KunAccordion>
  </div>
</template>
