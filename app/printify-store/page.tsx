'use client'
import { useEffect, useState } from 'react'
export default function Page(){
  const [products,setProducts]=useState<any[]>([])
  useEffect(()=>{fetch('/api/printify/products').then(r=>r.json()).then(d=>setProducts(d.data||[]))},[])
  return <div className="p-6"><h1 className="text-3xl font-bold">Dez Rebel Store</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">{products.map((p:any)=><div key={p.id} className="border p-4 rounded"><img src={p.images?.[0]?.src} className="w-full h-64 object-cover"/><p className="font-bold mt-2">{p.title}</p></div>)}</div></div>
}
