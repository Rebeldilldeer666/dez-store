import Link from 'next/link'
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-6 py-3 border-b border-zinc-900 sticky top-0 bg-black z-50">
        <img src="/images/logo.png" alt="DEZ-STORE" className="h-8 invert" />
        <div className="flex gap-6 text-[11px] font-mono tracking-widest">
          <Link href="/products" className="hover:text-red-500">[ SHOP ]</Link>
          <Link href="/cart" className="hover:text-red-500">[ CART ]</Link>
        </div>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-3 divide-x divide-y divide-zinc-900 border-b border-zinc-900">
        <div className="bg-zinc-950 group">
          <div className="aspect-[4/5] overflow-hidden bg-black">
            <img src="/images/hoodie.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Shadow Hoodie" />
          </div>
          <div className="p-4 flex justify-between">
            <div><div className="text-[10px] text-zinc-500 font-mono">001 / BLACKOPS</div><div className="font-black text-sm">SHADOW HOODIE</div></div>
            <div className="text-red-500 text-sm">$89</div>
          </div>
        </div>

        <div className="bg-zinc-950 group">
          <div className="aspect-[4/5] overflow-hidden bg-black">
            <img src="/images/tee.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Rebel Void Tee" />
          </div>
          <div className="p-4 flex justify-between">
            <div><div className="text-[10px] text-zinc-500 font-mono">002 / VOID</div><div className="font-black text-sm">REBEL VOID TEE</div></div>
            <div className="text-red-500 text-sm">$45</div>
          </div>
        </div>

        <div className="bg-zinc-950 group">
          <div className="aspect-[4/5] overflow-hidden bg-black">
            <img src="/images/cargo.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Termux Cargo" />
          </div>
          <div className="p-4 flex justify-between">
            <div><div className="text-[10px] text-zinc-500 font-mono">003 / UTILITY</div><div className="font-black text-sm">TERMUX CARGO</div></div>
            <div className="text-red-500 text-sm">$120</div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-[10px] font-mono text-zinc-600 flex justify-between">
        <span>REBEL-AI © 2026 // MANITOWOC, WI</span>
        <span>BUILT IN TERMUX ON ANDROID</span>
      </footer>
    </main>
  )
}
