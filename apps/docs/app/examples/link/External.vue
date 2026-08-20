<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunLink
      href="https://github.com/kungal/kun-ui"
      target="_blank"
      is-show-anchor-icon
    >
      默认 noopener noreferrer
    </KunLink>

    <!-- `rel` replaces that default rather than adding to it (NuxtLink's rule).
         Dropping `noreferrer` keeps the Referer header, so the destination's
         analytics records a referral from your site instead of direct traffic.
         `noopener` is added back to any target="_blank" link anyway. -->
    <KunLink
      href="https://github.com/kungal/kun-ui"
      target="_blank"
      rel="noopener"
      is-show-anchor-icon
    >
      rel="noopener"，保留来源
    </KunLink>
  </div>
</template>
