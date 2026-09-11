import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // La suite de mockups del concurso vive en public/mockups/. Next no
      // sirve el índice de un directorio estático, así que /mockups y
      // /mockups/ resuelven explícitamente a su index.html.
      { source: "/mockups", destination: "/mockups/index.html" },
      { source: "/mockups/", destination: "/mockups/index.html" },
    ];
  },
};

export default withNextIntl(nextConfig);
