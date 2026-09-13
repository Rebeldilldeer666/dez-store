export async function POST(){
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const key = process.env.PRINTIFY_API_KEY;
  const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
    headers:{Authorization:`Bearer ${key}`}
  });
  const data = await res.json();
  const products = Array.isArray(data) ? data : data.data || [];
  return Response.json({ printify_products: products.length, products: products.map((p:any)=>p.title) });
}
export const GET = POST;
