import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dez Store — Independent goods, thoughtfully made',
  description: 'Useful digital tools and considered goods for independent builders and creative minds.',
  metadataBase: new URL('https://dez-store.vercel.app'),
  openGraph: { title: 'Dez Store', description: 'Useful things for people making their own way.', type: 'website' },
}

export const viewport: Viewport = { themeColor: '#f0eee9', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body>{children}</body></html>
}
