'use client'

import { useEffect, useState } from 'react'

type Product = { id: string; name: string; description: string; amount: number; currency: string }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [message, setMessage] = useState('Loading products…')
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => { fetch('/api/products').then((r) => r.json()).then((data) => { setProducts(data.products ?? []); setMessage(data.products?.length ? '' : 'No products are available yet.') }).catch(() => setMessage('Store catalog unavailable.')) }, [])

  async function checkout(productId: string) {
    setBusy(productId)
    const response = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId }) })
    const data = await response.json()
    if (response.ok && data.url) window.location.assign(data.url)
    else setMessage(data.error ?? 'Checkout unavailable.')
    setBusy(null)
  }

  return <main><section className="shell" aria-labelledby="title"><p className="eyebrow">DEZ STORE / INDEPENDENT GOODS</p><h1 id="title">Make something worth breaking the rules for.</h1><p className="intro">Sharp digital tools and creative resources for independent builders. Secure checkout powered by Stripe.</p><div className="catalog" aria-live="polite">{message && <p className="status">{message}</p>}{products.map((product) => <article className="product" key={product.id}><div><h2>{product.name}</h2><p>{product.description}</p></div><button onClick={() => checkout(product.id)} disabled={busy !== null}>{busy === product.id ? 'Opening…' : `${(product.amount / 100).toLocaleString(undefined, { style: 'currency', currency: product.currency })} →`}</button></article>)}</div><footer>Secure payments. We never store card details. <a href="mailto:hello@rebelliousbytes.shop">Contact</a></footer></section></main>
}
