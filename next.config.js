/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Desativa os avisos de hidratação em produção
    suppressHydrationWarning: true,
  },
}

module.exports = nextConfig