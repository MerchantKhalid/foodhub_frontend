// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// ----------

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// ----------------------

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
