import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** 親ディレクトリの package-lock に引っ張られないよう、このプロジェクトを Turbopack のルートに固定 */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  // experimental の外（トップレベル）に移動してください
  allowedDevOrigins: ['127.0.0.1', 'localhost:3000'],
};

export default nextConfig;