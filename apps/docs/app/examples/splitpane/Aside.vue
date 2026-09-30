<template>
  <!-- primary="end": the width belongs to the right column; the main area takes
       the rest. A plain :size (no v-model) is just the starting width. -->
  <div class="border-default-200 rounded-kun-lg h-72 w-full overflow-hidden border">
    <KunSplitPane primary="end" :size="280" :min-size="220" :max-size="360">
      <template #start>
        <article class="h-full overflow-y-auto p-5">
          <h3 class="text-lg font-semibold">千恋＊万花</h3>
          <p class="text-default-700 mt-3 text-sm leading-6">
            穗织是一座被山环绕的温泉小镇。主角有地将臣在帮忙整理神社时，意外拔出了供奉在那里的神刀「丛雨丸」，
            从此被卷入与神刀之灵、巫女和小镇诅咒相关的一连串事件。
          </p>
        </article>
      </template>
      <template #end>
        <aside class="bg-content1 h-full space-y-3 overflow-y-auto p-4">
          <h4 class="text-sm font-semibold">标签</h4>
          <div class="flex flex-wrap gap-1.5">
            <KunChip size="sm" variant="flat">纯爱</KunChip>
            <KunChip size="sm" variant="flat">和风</KunChip>
            <KunChip size="sm" variant="flat">神社</KunChip>
            <KunChip size="sm" variant="flat">温泉</KunChip>
          </div>
          <h4 class="text-sm font-semibold">同社作品</h4>
          <ul class="text-default-700 space-y-1 text-sm">
            <li>天使☆騒々 RE-BOOT!</li>
            <li>喫茶ステラと死神の蝶</li>
            <li>サノバウィッチ</li>
          </ul>
        </aside>
      </template>
    </KunSplitPane>
  </div>
</template>
