import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

const DEZ_IMAGES = ["/dez-stoic.png", "/dez-laughing.png"]

const FALLBACK_PRODUCTS = [
  { id: "01", name: "Snake Line Art Pack", price: 14.99, stripe_link: "" },
  { id: "02", name: "Dark Audio Loops", price: 34.99, stripe_link: "" },
  { id: "03", name: "Tattoo Flash Vault", price: 97.00, stripe_link: "" },
  { id: "04", name: "Prompt Empire 300", price: 147.00, stripe_link: "" },
  { id: "05", name: "FULL 415 VAULT", price: 497.50, stripe_link: "", featured: true },
]

function App(){
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [cart, setCart] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    fetch("/products.json").then(r=>r.json()).then(data=>{
      if(data.products){
        const parsed = data.products.map(p=>{
          let priceNum = parseFloat((p.price||"").replace("$",""))
          return { ...p, price: priceNum, price_label: p.price }
        })
        setProducts(parsed)
      }
    }).catch(()=>{})
  },[])

  const add = (p)=>{
    setCart(prev=>{
      const f=prev.find(i=>i.id===p.id)
      if(f) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i)
      return [...prev,{...p,qty:1}]
    })
    setOpen(true)
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const count = cart.reduce((s,i)=>s+i.qty,0)

  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",fontFamily:"monospace"}}>
      <header style={{display:"flex",justifyContent:"space-between",padding:"20px",borderBottom:"1px solid #222",position:"sticky",top:0,background:"black",zIndex:10}}>
        <h1 style={{letterSpacing:"8px",margin:0}}>DEZ REBEL</h1>
        <button onClick={()=>setOpen(!open)} style={{border:"1px solid white",background:"black",color:"white",padding:"10px 20px",fontFamily:"monospace"}}>CART ({count}) — ${total.toFixed(2)}</button>
      </header>

      <div style={{padding:"20px"}}>
        <h2 style={{fontSize:"28px",letterSpacing:"4px"}}>DEZ REBEL EMPIRE - 415 TOOLS</h2>
        <p style={{color:"#888"}}>GREMLIN HORDE // DEZ ONE FILE ONLY — LIVE DROP // 8323e19 • 5 PRODUCTS • FULL VAULT $497.50</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"20px",padding:"20px"}}>
        {products.map((p,idx)=>(
          <div key={p.id} style={{border: p.featured || p.id==="05" ? "1px solid white" : "1px solid #222", background: p.id==="05" ? "#111" : "black"}}>
            <div style={{height:"320px",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              <img src={DEZ_IMAGES[idx % DEZ_IMAGES.length]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",padding:"12px"}}/>
            </div>
            <div style={{padding:"18px"}}>
              <div style={{fontSize:"12px",color:"#666"}}>0{p.id} // {p.featured || p.id==="05" ? "VAULT" : "TOOL"}</div>
              <h3 style={{margin:"6px 0",fontSize:"16px"}}>{p.name}</h3>
              <p style={{margin:"0 0 14px 0",fontSize:"18px"}}>${p.price.toFixed(2)}</p>
              <button onClick={()=>add(p)} style={{width:"100%",padding:"14px",background:"white",color:"black",fontWeight:"bold",border:"none",fontFamily:"monospace"}}>ADD TO CART</button>
              {p.stripe_link && p.stripe_link.startsWith("http") && <a href={p.stripe_link} target="_blank" style={{display:"block",textAlign:"center",marginTop:"10px",color:"#888",fontSize:"11px"}}>BUY DIRECT ON STRIPE →</a>}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div style={{position:"fixed",right:0,top:0,width:"100%",maxWidth:"420px",height:"100vh",background:"#0a0a0a",borderLeft:"1px solid #333",padding:"20px",zIndex:20,overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><h2>YOUR CART</h2><button onClick={()=>setOpen(false)} style={{background:"transparent",color:"white",border:"1px solid #333",padding:"6px 12px",fontFamily:"monospace"}}>CLOSE</button></div>
          {cart.length===0 && <p style={{color:"#666",marginTop:"40px"}}>Empty. Add some heat from the vault.</p>}
          {cart.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",marginTop:"18px",borderBottom:"1px solid #222",paddingBottom:"10px"}}><div>{i.name} x{i.qty}</div><div>${(i.price*i.qty).toFixed(2)}</div></div>)}
          {cart.length>0 && <>
            <div style={{marginTop:"30px",display:"flex",justifyContent:"space-between",fontSize:"20px"}}><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
            <button onClick={()=>{alert('Replace STRIPE_LINK_0X in products.json with real Stripe payment links to go live');}} style={{width:"100%",marginTop:"20px",padding:"16px",background:"white",color:"black",fontWeight:"bold",border:"none",fontFamily:"monospace"}}>CHECKOUT — ${total.toFixed(2)}</button>
            <button onClick={()=>setCart([])} style={{width:"100%",marginTop:"10px",padding:"12px",background:"transparent",color:"#666",border:"1px solid #222",fontFamily:"monospace"}}>CLEAR CART</button>
            <p style={{marginTop:"20px",fontSize:"11px",color:"#555"}}>Next: paste your real Stripe links into public/products.json where it says STRIPE_LINK_01 etc and redeploy.</p>
          </>}
        </div>
      )}

      <footer style={{padding:"40px 20px",borderTop:"1px solid #222",marginTop:"40px",color:"#444",fontSize:"11px"}}>© DEZ REBEL EMPIRE // ONE FILE ONLY // BUILT IN TERMINAL ON 5G // dez-store.vercel.app</footer>
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
