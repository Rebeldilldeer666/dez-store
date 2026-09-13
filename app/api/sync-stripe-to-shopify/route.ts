import Stripe from 'stripe';
import { createAdminApiClient } from '@shopify/admin-api-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const shopify = createAdminApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-07',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
});

export async function POST(){
  const products = await stripe.products.list({ active:true, limit:100, expand:['data.default_price'] });
  const out:any[] = [];
  for(const p of products.data){
    const price = p.default_price as Stripe.Price;
    if(!price?.unit_amount) continue;
    const amount = (price.unit_amount/100).toFixed(2);
    const handle = (p.metadata.shopify_handle || p.id).toLowerCase().replace(/[^a-z0-9-]/g,'-');
    const exists = await shopify.request(`query($h:String!){ productByHandle(handle:$h){ id } }`, { variables:{ h: handle } });
    let id = (exists.data as any)?.productByHandle?.id;
    if(!id){
      const created = await shopify.request(`mutation($input:ProductInput!){ productCreate(input:$input){ product{id handle} userErrors{message} } }`, {
        variables:{ input:{ title:p.name, descriptionHtml:p.description||"", handle, vendor:"DEZ REBEL", productType:"Streetwear", status:"ACTIVE" } }
      });
      id = (created.data as any).productCreate.product.id;
    }
    await shopify.request(`mutation($id:ID!,$v:[ProductVariantsBulkInput!]!){ productVariantsBulkCreate(productId:$id, variants:$v){ userErrors{message} } }`, {
      variables:{ id, v:[{ price: amount, sku:p.id }] }
    });
    out.push(`${p.name} -> $${amount}`);
  }
  return Response.json({ synced: out });
}
export const GET = POST;
