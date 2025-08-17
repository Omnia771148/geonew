import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is no longer needed in Next.js 15
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // force enable even in localhost
})(nextConfig);