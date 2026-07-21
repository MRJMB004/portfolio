// Génère public/sitemap.xml à partir des routes statiques + des projets.
// Utilisé automatiquement au build (voir package.json) et exécutable seul via
// `npm run sitemap`.
//
// Si VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY sont définis, les slugs de
// projets sont lus depuis Supabase ; sinon, on retombe sur src/data/projects.js.

import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE_URL = process.env.SITE_URL || "https://setra-portfolio.vercel.app";

async function getProjectSlugs() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/projects?select=slug`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const rows = await res.json();
        return rows.map((r) => r.slug);
      }
    } catch {
      // ignore, fallback below
    }
  }

  // Fallback : parse src/data/projects.js pour les slugs (évite un import ESM/CJS croisé)
  const raw = readFileSync(join(ROOT, "src/data/projects.js"), "utf8");
  const matches = [...raw.matchAll(/slug:\s*"([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

const staticRoutes = ["/", "/#about", "/#skills", "/#projects", "/#experience", "/#contact"];

const slugs = await getProjectSlugs();
const projectRoutes = slugs.map((slug) => `/project/${slug}`);

const urls = [...staticRoutes, ...projectRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(ROOT, "public/sitemap.xml"), xml);
console.log(`sitemap.xml généré avec ${urls.length} URLs.`);
