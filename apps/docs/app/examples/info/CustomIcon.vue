<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunInfo color="primary" icon="lucide:eye" title="提示" description="使用 icon 属性传入已注册的图标名称。" />
    <KunInfo color="success" icon="lucide:download" title="下载就绪" description="点击即可下载文件。" />
    <KunInfo color="warning" icon="lucide:triangle-alert" title="警告" description="此操作不可撤销。" />
    <KunInfo color="danger" icon="lucide:circle-x" title="失败" description="请求未能完成。" />
  </div>
</template>
