/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: '/pos-order-flow',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
