import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "is1-ssl.mzstatic.com" },
      { hostname: "is2-ssl.mzstatic.com" },
      { hostname: "is3-ssl.mzstatic.com" },
      { hostname: "is4-ssl.mzstatic.com" },
      { hostname: "is5-ssl.mzstatic.com" },
      { hostname: "e-cdns-images.dzcdn.net" },
      { hostname: "cdn-images.dzcdn.net" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lastfm.freetls.fastly.net" },
    ],
  },
};

export default nextConfig;
