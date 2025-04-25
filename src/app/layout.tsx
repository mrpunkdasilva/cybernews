import '../app/globals.css'
import type { Metadata } from 'next'
import { Orbitron, Share_Tech_Mono, Rajdhani } from 'next/font/google'

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
});

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: 'CyberNews',
  description: 'A cyberpunk Hacker News client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable}`}>
      <body>{children}</body>
    </html>
  )
}