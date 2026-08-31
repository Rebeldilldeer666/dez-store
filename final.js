const TOKEN=process.env.TOKEN
async function api(p,o={}){const r=await fetch(`https://api.printify.com/v1${p}`,{...o,headers:{Authorization:`Bearer ${TOKEN}`,"Content-Type":"application/json",...(o.headers||{})}});const j=await r.json();return j}
;(async()=>{
  let shops=await api("/shops.json")
  shops=shops.data||shops
  console.log("shops",shops.length)
  const shopId=shops[0].id
  let prods=await api(`/shops/${shopId}/products.json`)
  prods=prods.data||prods
  console.log("you have",prods.length)
  const base=prods.find(p=>!p.title.toLowerCase().includes("aop")&&!p.title.toLowerCase().includes("polyester"))||prods[0]
  console.log("Base",base.title)
  const full=await api(`/shops/${shopId}/products/${base.id}.json`)
  for(let i=prods.length+1;i<=20;i++){
    console.log(`Creating #${i}`)
    const payload={title:`ALWAYS PREVAIL #${i} - ${full.title}`,description:full.description,blueprint_id:full.blueprint_id,print_provider_id:full.print_provider_id,variants:full.variants.map(v=>({id:v.id,price:v.price,is_enabled:true})),print_areas:full.print_areas}
    const created=await api(`/shops/${shopId}/products.json`,{method:"POST",body:JSON.stringify(payload)})
    if(!created.id){console.log("FAIL",JSON.stringify(created).slice(0,400));continue}
    await api(`/shops/${shopId}/products/${created.id}/publish.json`,{method:"POST",body:JSON.stringify({title:true,description:true,images:true,variants:true})})
    console.log("Published",i)
    await new Promise(r=>setTimeout(r,1000))
  }
  console.log("DONE")
})()
