#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Configure your site base URL here
const BASE = process.env.SITE_BASE || 'https://hanjunt.github.io/high-school-gallery/';

const outPath = path.join(__dirname, '..', 'sitemap.xml');
const files = [];

// Add the main page
files.push({ loc: BASE, changefreq: 'weekly' });

// Add images/full entries
const imagesDir = path.join(__dirname, '..', 'images', 'full');
if (fs.existsSync(imagesDir)) {
  const imgs = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|gif|JPG|JPEG)$/i.test(f));
  imgs.forEach(fname => {
    const fullUrl = new URL(`images/full/${fname}`, BASE).href;
    const stats = fs.statSync(path.join(imagesDir, fname));
    const lastmod = stats.mtime.toISOString();
    files.push({ loc: fullUrl, lastmod, changefreq: 'monthly' });
  });
}

const entries = files.map(f => {
  return `  <url>\n    <loc>${f.loc}</loc>${f.lastmod ? `\n    <lastmod>${f.lastmod}</lastmod>` : ''}\n    <changefreq>${f.changefreq || 'monthly'}</changefreq>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;

fs.writeFileSync(outPath, xml, 'utf8');
console.log('sitemap.xml written to', outPath);
