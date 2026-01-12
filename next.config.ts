import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://172.16.3.194:3000",
  ],
  reactCompiler: true,
};

export default nextConfig;
