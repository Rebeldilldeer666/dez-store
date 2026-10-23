import Link from 'next/link'

export default function RapidIncomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-background px-6 py-12 text-foreground">
      <div className="flex items-start justify-between gap-6 border-b pb-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">DEZ Store</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Rapid Income</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Live Shopify operations overview for the RebelAI-2 store.</p>
        </div>
        <Link className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted" href="/api/shopify/products">View product API</Link>
      </div>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Connection</p>
          <p className="mt-2 text-2xl font-semibold">Live Shopify</p>
          <p className="mt-2 text-sm text-muted-foreground">Data is read from the configured Shopify Admin API.</p>
        </article>
        <article className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Endpoints</p>
          <div className="mt-3 space-y-2 text-sm">
            <Link className="block underline underline-offset-4" href="/api/sync">Run connection sync</Link>
            <Link className="block underline underline-offset-4" href="/api/shopify/products">List products</Link>
          </div>
        </article>
      </section>
    </main>
  )
}
