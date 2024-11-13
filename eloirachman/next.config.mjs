/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
  },
  images: {
    domains: ['tsjrcymimjfsfqbrymgl.supabase.co'],
  },
}

export default nextConfig;
