/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // domains: ["cdn2.iconfinder.com", "ahocevar.com"],
      remotePatterns: [
        {
          protocol: "http",
          hostname: "**",
        },
      ],
    },
  };
  
  module.exports = nextConfig
  