export const dynamic = 'force-dynamic'

const domain = process.env.Shopifydomain ?? process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

export async function GET() {
  if (!domain || !token) {
    return Response.json({ live: false, products: [], status: 'Shopify configuration is missing' }, { status: 503 })
  }

  const response = await fetch(`https://${domain}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: '{ products(first: 25) { nodes { id title handle status } } shop { name } }' }),
    cache: 'no-store',
  })
  const result = await response.json()

  if (result.errors) {
    return Response.json({ live: false, products: [], status: 'Shopify access denied', errors: result.errors })
  }

  const products = result.data?.products?.nodes ?? []
  return Response.json({ live: true, status: 'Shopify connected', shop: result.data?.shop, products, count: products.length })
}
