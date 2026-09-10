'use client'
import { useEffect, useState } from 'react'

type Product = {
  id: string
  title: string
  images: { src: string }[]
  variants: { id: number; price: number }[]
}

export default function PrintifyStorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/printify/products')
     .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'Failed to load')
        setProducts(data.data || [])
      })
     .catch((e) => setError(e.message))
     .finally(() => setLoading(false))
  }, [])

  async function buy(p: Product) {
    try {
      setBuying(p.id)
      const variant = p.variants?.[0]
      if (!variant) throw new Error('No variant')
      const res = await fetch('/api/checkout/printify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: p.title,
          price: variant.price,
          image: p.images?.[0]?.src,
          variantId: variant.id,
          productId: p.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.url) window.location.href = data.url
    } catch (e: any) {
      alert(e.message)
      setBuying(null)
    }
  }

  if (loading) return <div className="p-10 text-center">Loading Dez Rebel Catalog...</div>
  if (error) return <div className="p-10 text-center text-red-500">Error: {error} - Check Vercel Env Vars</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter">DEZ REBEL STORE</h1>
      <p className="opacity-60 mt-2 mb-8">Official Printify Collection - Printed On Demand</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border border-zinc-800 rounded-2xl p-4 flex flex-col">
            <img src={p.images?.[0]?.src} alt={p.title} className="w-full h-80 object-cover rounded-xl bg-zinc-900" />
            <h2 className="font-bold mt-4 line-clamp-1">{p.title}</h2>
            <p className="font-black text-xl mt-2">${(p.variants?.[0]?.price / 100).toFixed(2)}</p>
            <button
              onClick={() => buy(p)}
              disabled={buying === p.id}
              className="mt-4 w-full bg-white text-black py-3 rounded-xl font-black hover:bg-zinc-200 disabled:opacity-50"
            >
              {buying === p.id? 'REDIRECTING...' : 'BUY NOW'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
