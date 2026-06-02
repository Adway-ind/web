import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://adway.agency';

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/career', priority: '0.6', changefreq: 'weekly' },
  { path: '/apply', priority: '0.5', changefreq: 'monthly' },
  { path: '/social', priority: '0.4', changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const outputPath = path.join(__dirname, '../dist/sitemap.xml');

// Ensure dist directory exists
if (!fs.existsSync(path.join(__dirname, '../dist'))) {
  fs.mkdirSync(path.join(__dirname, '../dist'), { recursive: true });
}

fs.writeFileSync(outputPath, sitemap);
console.log('✅ Sitemap generated at:', outputPath);
