import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack(config) {
    // alias '@' → /src
    config.resolve.alias["@"] = __dirname + "/src";
    return config;
  },
};

export default nextConfig;
