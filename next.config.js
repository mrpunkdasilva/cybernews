/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Desativa os avisos de hidratação em produção
  },
}

module.exports = nextConfig