/** Static export for GitHub Pages, served at the root of abhishekchugh707.github.io. */
const basePath = process.env.BASE_PATH ?? "";
export default {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_ASSET_BASE: process.env.ASSET_BASE ?? basePath,
    NEXT_PUBLIC_ANALYTICS: process.env.ANALYTICS ?? "on",
  },
};
