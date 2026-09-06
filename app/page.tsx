'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Product = { id: string; name: string; description: string; amount: number; currency: string; kind?: 'physical' | 'digital' }

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100)
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState('Loading the current catalog…')
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/products', { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setProducts(data.products ?? [])
        setStatus(data.products?.length ? '' : 'The catalog is being prepared. Check back soon.')
      })
      .catch((error) => { if (error.name !== 'AbortError') setStatus('The catalog is temporarily unavailable. Please try again soon.') })
    return () => controller.abort()
  }, [])

  function reloadCatalog() {
    window.location.reload()
  }

  async function startCheckout(productId: string) {
    setBusy(productId)
    setStatus('')
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId }) })
      const data = await response.json()
      if (!response.ok || !data.url) throw new Error(data.error)
      window.location.assign(data.url)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Checkout is unavailable.'); setBusy(null) }
  }

  return <main>
    <nav className="nav" aria-label="Main navigation"><a className="brand" href="#top">DEZ<span> / STORE</span></a><a href="#catalog">Shop the collection</a></nav>
    <section className="hero" id="top" aria-labelledby="title"><div className="hero-copy"><p className="eyebrow">INDEPENDENT GOODS / EST. 2026</p><h1 id="title">Useful things for people making their own way.</h1><p className="intro">Digital tools and considered goods for independent builders, makers, and creative minds.</p><a className="hero-link" href="#catalog">Explore the collection <span aria-hidden="true">↓</span></a></div><div className="hero-note" aria-label="Store promise"><Image src="/assets/dez-stoic.png" alt="Dez Store character illustration" width={80} height={80} priority /><span>01</span><p>Made with intent.<br />Delivered securely.</p></div></section>
    <section className="catalog-section" id="catalog" aria-labelledby="catalog-title"><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2 id="catalog-title">Current releases</h2></div><p className="section-note">Real-time inventory<br />from our secure catalog</p></div><div className="catalog" aria-live="polite">{status && <div className="status" role="status"><p>{status}</p>{status.includes('unavailable') && <button className="retry" type="button" onClick={reloadCatalog}>Try again</button>}</div>}{products.map((product, index) => <article className="product" key={product.id}><span className="product-index">{String(index + 1).padStart(2, '0')}</span><div className="product-copy"><div className="product-meta"><span>{product.kind === 'physical' ? 'Physical good' : 'Digital resource'}</span><span aria-hidden="true">•</span><span>Available now</span></div><h3>{product.name}</h3><p>{product.description}</p></div><button onClick={() => startCheckout(product.id)} disabled={busy !== null} aria-label={`Buy ${product.name}`}>{busy === product.id ? 'Opening…' : `${formatPrice(product.amount, product.currency)} ↗`}</button></article>)}</div></section>
    <footer><div><p className="eyebrow">DEZ / STORE</p><p className="footer-copy">Independent goods, thoughtfully made.</p></div><div className="footer-links"><a href="mailto:hello@rebelliousbytes.shop">Contact</a><span>Secure checkout by Stripe</span></div></footer>
  </main>
}
