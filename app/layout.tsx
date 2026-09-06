import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dez Store | Independent goods',
  description: 'Sharp tools and creative resources for independent builders.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-[#0b0d12]"><body>{children}</body></html>
}
