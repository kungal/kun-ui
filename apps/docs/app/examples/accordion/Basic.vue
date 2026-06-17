<template>
  <KunAccordion class-name="max-w-lg">
    <KunAccordionItem value="what" title="KunUI 是什么?">
      专为 ACGN 网站设计的现代无头 UI 组件库,支持 Vue / Nuxt。
    </KunAccordionItem>
    <KunAccordionItem value="ssr" title="支持 SSR 吗?">
      支持。组件以 SSR 安全为前提设计,水合无闪烁。
    </KunAccordionItem>
    <KunAccordionItem value="a11y" title="无障碍如何?">
      头部是真正的按钮(aria-expanded / aria-controls),内容区域用 role=region 关联。
    </KunAccordionItem>
  </KunAccordion>
</template>
