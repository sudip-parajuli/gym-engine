import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages: ["node:sqlite"],
  turbopack: { root: process.cwd() },
};
export default config;
