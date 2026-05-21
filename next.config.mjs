/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/pos-order-flow' : '';

const nextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
