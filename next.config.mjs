/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "instagram.fcai2-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    API_BASE_URL:
      process.env.STAGE === "dev"
        ? "https://devapi.crclevents.com"
        : process.env.NODE_ENV === "production"
        ? "https://api.crclevents.com"
        : "http://localhost:2002",
  },
};

export default nextConfig;
