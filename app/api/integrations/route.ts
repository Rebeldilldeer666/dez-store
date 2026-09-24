export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Stripe from 'stripe';
export async function GET(){
  const status:any = { time: new Date().toISOString() };
  try {
    const r = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-10/products.json`, {
      headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN! }
    });
    status.shopify = r.ok? `CONNECTED - ${process.env.SHOPIFY_STORE_DOMAIN}` : `FAILED ${r.status}`;
  } catch(e:any){ status.shopify = `ERROR: ${e.message}`; }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const prods = await stripe.products.list({limit:1});
    status.stripe = `CONNECTED - ${prods.data.length} products`;
  } catch(e:any){ status.stripe = `ERROR: ${e.message}`; }
  try {
    const r = await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, {
      headers: { 'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}` }
    });
    status.printify = r.ok? `CONNECTED` : `FAILED ${r.status}`;
  } catch(e:any){ status.printify = `ERROR: ${e.message}`; }
  return Response.json(status);
}
