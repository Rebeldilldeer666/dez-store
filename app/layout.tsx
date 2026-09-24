import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEZ-STORE',
  description: 'E-commerce platform with integrated payment and fulfillment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
              <img src="/images/logo.png" alt="DEZ-STORE Logo" className="h-8 mr-2" />
              DEZ-STORE
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
                <li><Link href="/products" className="text-gray-600 hover:underline">Products</Link></li>
                <li><Link href="/cart" className="text-gray-600 hover:underline relative">
                  Cart
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main>
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} DEZ-STORE. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}