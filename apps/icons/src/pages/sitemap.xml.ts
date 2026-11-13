import { readFileSync } from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const dataRoot = path.join(process.cwd(), "public", "data");
  const manifest = JSON.parse(readFileSync(path.join(dataRoot, "manifest.json"), "utf8"));
  const base = (site ?? new URL("https://icons.abhayaui.workers.dev")).toString().replace(/\/$/, "");

  const urls = [
    "/",
    ...manifest.icons.map((icon: { name: string }) => `/icons/${icon.name}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url><loc>${base}${url}</loc><changefreq>weekly</changefreq><priority>${url === "/" ? "1.0" : "0.6"}</priority></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
