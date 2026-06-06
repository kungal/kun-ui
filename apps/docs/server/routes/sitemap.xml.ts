import { site, pageMeta } from '../../app/site.config'

// Generated from the same pageMeta the SEO composable uses, so the sitemap can
// never drift from the actual pages. Prerendered to a static file (see
// nuxt.config nitro.prerender).
export default defineEventHandler((event) => {
  const urls = Object.keys(pageMeta)
    .map((path) => `  <url><loc>${site.url}${path}</loc></url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
