'use client'
import { useEffect, useState } from 'react'

export default function Page(){
  const [products,setProducts]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [buying,setBuying]=useState<string | null>(null)

  useEffect(()=>{
    fetch('/api/printify/products')
     .then(r=>r.json())
     .then(d=>{
        setProducts(d.data || [])
        setLoading(false)
      })
  },[])

  async function buy(p:any){
    setBuying(p.id)
    const variant = p.variants?.[0]
    const price = variant?.price // Printify price is in cents
    const title = p.title
    const image = p.images?.[0]?.src
    const res = await fetch('/api/checkout/printify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price, image, variantId: variant?.id, productId: p.id })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else {
      alert(data.error)
      setBuying(null)
    }
  }

  if(loading) return <div className="p-10 text-center">Loading Dez Rebel catalog...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black mb-2">Dez Rebel Store</h1>
      <p className="opacity-70 mb-8">Direct from Printify • Printed on demand</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p:any)=>(
          <div key={p.id} className="border rounded-2xl p-4 shadow-sm flex flex-col">
            <img src={p.images?.[0]?.src} className="w-full h-80 object-cover rounded-xl mb-4" alt={p.title} />
            <h2 className="font-bold text-lg line-clamp-1">{p.title}</h2>
            <p className="text-sm opacity-60 mt-1 line-clamp-2">{p.tags?.join(', ')}</p>
            <p className="mt-3 font-black text-xl">${(p.variants?.[0]?.price/100).toFixed(2)}</p>
            <button
              onClick={()=>buy(p)}
              disabled={buying===p.id}
              className="mt-4 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50"
            >
              {buying===p.id? 'Redirecting to Stripe...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
