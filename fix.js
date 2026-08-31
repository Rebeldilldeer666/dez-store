const TOKEN="PASTE_YOUR_TOKEN_HEREeyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjMxZmU3Nzg2ZTE0NzRiMWM4NmRmZjkxZmU5ODNlZDQ2ZGZhN2UwZjJlMGVkNGU3YzYwMjI2MjUwMTNkNzQ4NDgzNDQxZGUxN2Q3NDY4M2FiIiwiaWF0IjoxNzg4MDMxMTUyLjY4MjUzNywibmJmIjoxNzg4MDMxMTUyLjY4MjUzOSwiZXhwIjoxODE5NTY3MTUyLjY3NDUyNCwic3ViIjoiMjY3NjE1MTQiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.mFFmkSpFvItsTA8W5aFFX44tC99xVOGbPVfQKV06nGMcrUlhB5S6TNhvL-kbzzINn7TshtYnAoKdOvh6-XfyvKABD05-gdfoqPxRQAkXQHLZUm1s0usA3cM2Vz0KSLK1zBzxQeEBkMLFcOvUa0XQD-CcUQQmCdziVLN9SBUnGuIsshCZ2U2-NHcy5IEhANW-GozAbz1fXe4dSEpt2p-_40oG6XVvLT4zlYJIkzjHbc-qChhPguz6IaWLqZUCZP-UtxTMxzSN2ZydWZpORKonJ86PG8FA0gV2oePUl1W6DcDZM_84Kv0CDujd8NOAOK86rmNy2EalDffHhWjXRfg4i190g6E1coClhuVx4fhEFNCQ353bMTBzKhp8afjhkj9q8KQAO5Nc8C1GCZEZu_geBhjs18OAZ_GLN8HXn6wBDtbQeSRtST_9PmyE18FOgvPYVICZNJL8a25XQ5ed4TZbvW-s9izmkrF0V6Mi-vzTrUpAKjrEMQpQ1UqXjZWAbImKRMqmREpwv08QELkGt1P0_4ivZZMUtlKS1xna1CRFa-s2xQ1OpcM65pgegtR6FoiZF1IRbCjVlVyEDcKCt9T23EMF9G-YL3YQK3gHB3hKCLH6bOxO-Ua0QqNRnlXydtIvO7tSmyFRkWHfydXM1okislvOIX4HLY2pfvWDOG47m7A"
async function api(p,o={}){const r=await fetch(`https://api.printify.com/v1${p}`,{...o,headers:{Authorization:`Bearer ${TOKEN}`,"Content-Type":"application/json",...(o.headers||{})}});return r.json()}
;(async()=>{
  const shops=await api("/shops.json")
  const shopId=shops.find(s=>s.title.toLowerCase().includes("dez"))?.id||shops[0].id
  const prods=await api(`/shops/${shopId}/products.json`)
  const list=prods.data||prods
  const base=list.find(p=>!p.title.toLowerCase().includes("aop")&&!p.title.toLowerCase().includes("polyester"))||list[0]
  console.log("Base:",base.title)
  const full=await api(`/shops/${shopId}/products/${base.id}.json`)
  for(let i=list.length+1;i<=20;i++){
    console.log(`Creating #${i}`)
    const payload={title:`ALWAYS PREVAIL #${i} - ${full.title}`,description:full.description,blueprint_id:full.blueprint_id,print_provider_id:full.print_provider_id,variants:full.variants.map(v=>({id:v.id,price:v.price,is_enabled:true})),print_areas:full.print_areas}
    const created=await api(`/shops/${shopId}/products.json`,{method:"POST",body:JSON.stringify(payload)})
    if(created.id){await api(`/shops/${shopId}/products/${created.id}/publish.json`,{method:"POST",body:JSON.stringify({title:true,description:true,images:true,variants:true})});console.log("Published",i)}else{console.log("Fail",JSON.stringify(created).slice(0,300))}
    await new Promise(r=>setTimeout(r,1200))
  }
  console.log("DONE - 20 LIVE")
})()
