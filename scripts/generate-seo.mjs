// Genera public/robots.txt y public/sitemap.xml con la URL de .env (se ejecuta solo antes de `npm run build`)
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

let url = process.env.VITE_SITE_URL
if (!url && existsSync('.env')) {
  const m = readFileSync('.env', 'utf8').match(/^VITE_SITE_URL=(.+)$/m)
  if (m) url = m[1].trim()
}
url = (url || '').replace(/\/$/, '')
if (!url || url.includes('tu-dominio')) {
  console.warn('\n⚠️  VITE_SITE_URL todavía es de ejemplo. Editá el archivo .env con tu dominio real antes de publicar.\n')
}

const hoy = new Date().toISOString().slice(0, 10)
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`)
writeFileSync(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
)
console.log('SEO: robots.txt y sitemap.xml generados para', url)
