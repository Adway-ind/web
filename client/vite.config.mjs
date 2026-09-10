import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let sitemapOutDir = "dist";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_TARGET || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: process.env.VITE_API_TARGET || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "generate-sitemap",
      configResolved(config) {
        sitemapOutDir = config.build.outDir;
      },
      async closeBundle() {
        const SITE_URL = "https://adway.agency";
        const routes = [
          { path: "/", priority: "1.0", changefreq: "daily" },
          { path: "/about", priority: "0.8", changefreq: "monthly" },
          { path: "/services", priority: "0.9", changefreq: "monthly" },
          { path: "/portfolio", priority: "0.9", changefreq: "weekly" },
          { path: "/contact", priority: "0.7", changefreq: "monthly" },
          { path: "/career", priority: "0.6", changefreq: "weekly" },
          { path: "/apply", priority: "0.5", changefreq: "monthly" },
          { path: "/social", priority: "0.4", changefreq: "monthly" },
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

        const outputPath = path.resolve(__dirname, sitemapOutDir, "sitemap.xml");
        try {
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, sitemap);
          console.log("sitemap.xml generated");
        } catch (error) {
          console.warn(`sitemap.xml could not be generated: ${error.message}`);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
