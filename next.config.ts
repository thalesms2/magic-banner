import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
      remotePatterns: [new URL('https://bgkgrmlxspyrgazfiilc.supabase.co/storage/v1/object/public/banner_images/public/**')],
  }
};

export default nextConfig;
