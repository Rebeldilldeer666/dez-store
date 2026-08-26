import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

const IMAGES = ["/dez-stoic.png", "/dez-laughing.png"]

function App(){
  const [products,setProducts] = useState([
    { id:"01", name:"Snake Line Art Pack", price:"$14.99", tag:"BESTSELLER", link:"https://buy.stripe.com/9B6fZhbA8115dwwaxZ18d2Q" },
    { id:"02", name:"Dark Audio Loops", price:"$34.99", tag:"NEW", link:"https://buy.stripe.com/5kQ00jgUseRV8ccaxZ18d2O" },
    { id:"03", name:"Tattoo Flash Vault", price:"$97.00", tag:"VAULT", link:"https://buy.stripe.com/3cI00j8nW4dh0JKeOf18d2N" },
    { id:"04", name:"Prompt Empire 300", price:"$147.00", tag:"AI", link:"https://buy.stripe.com/dRm00jaw425950035x18d2M" },
    { id:"05", name:"FULL 415 VAULT", price:"$497.50", tag:"ALL ACCESS", featured:true, link:"https://buy.stripe.com/5kQfZh6fOcJNgII5dF18d2L" },
    { id:"06", name:"Rebel Drop 06", price:"$47.00", tag:"DROP", link:"https://buy.stripe.com/00w7sLaw49xBboocG718d2P" },
  ])

  useEffect(()=>{
    fetch("/products.json").then(r=>r.json()).then(d=>{
      if(d.products){
        setProducts(d.products.map((p,i)=>({
          id:p.id,
          name:p.name,
          price:p.price,
          tag: p.featured ? "ALL ACCESS" : "TOOL",
          featured: p.featured,
          link: p.stripe_link
        })))
      }
    }).catch(()=>{})
  },[])

  return (
    <div style={{background:"#050505", color:"white", minHeight:"100vh", fontFamily:"'Helvetica Neue', monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');
        *{font-family:'Space Grotesk', monospace !important}
        .card:hover{transform:translateY(-4px); border-color:white !important}
        .card{transition: all 0.2s ease}
        .img-wrap{background: radial-gradient(circle at center, #1a1a1a 0%, #050505 70%)}
      `}</style>

      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 32px", borderBottom:"1px solid #111"}}>
        <div style={{letterSpacing:"10px", fontWeight:700, fontSize:"20px"}}>DEZ REBEL</div>
        <div style={{fontSize:"11px", color:"#666", letterSpacing:"2px"}}>415 PRODUCTS // EST. 2025</div>
      </header>

      <div style={{padding:"60px 32px 30px", maxWidth:"1200px", margin:"0 auto"}}>
        <h1 style={{fontSize:"clamp(32px, 6vw, 64px)", lineHeight:"0.9", margin:0, letterSpacing:"-2px"}}>REBEL<br/>GREMLIN<br/>EMPIRE.</h1>
        <p style={{color:"#888", marginTop:"20px", maxWidth:"420px", fontSize:"14px", lineHeight:"1.6"}}>One file only. No fluff. Hand-drawn snakes, dark audio, AI prompts, flash vault. Built in terminal on 5G. Dez is the mascot. The vault is the product.</p>
        <a href="#products" style={{display:"inline-block", marginTop:"24px", border:"1px solid white", padding:"12px 24px", color:"white", textDecoration:"none", fontSize:"12px", letterSpacing:"2px"}}>VIEW VAULT ↓</a>
      </div>

      <div id="products" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:"1px", background:"#111", borderTop:"1px solid #111", borderBottom:"1px solid #111", maxWidth:"1200px", margin:"0 auto"}}>
        {products.map((p,i)=>(
          <a key={p.id} href={p.link} target="_blank" className="card" style={{background:"black", textDecoration:"none", color:"white", border:"1px solid transparent", display:"block"}}>
            <div className="img-wrap" style={{height:"380px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative"}}>
              <span style={{position:"absolute", top:"16px", left:"16px", fontSize:"10px", border:"1px solid #333", padding:"4px 8px", color:"#888"}}>{p.id} — {p.tag}</span>
              {p.featured && <span style={{position:"absolute", top:"16px", right:"16px", fontSize:"10px", background:"white", color:"black", padding:"4px 8px", fontWeight:700}}>FEATURED</span>}
              <img src={IMAGES[i % IMAGES.length]} alt={p.name} style={{width:"85%", height:"85%", objectFit:"contain"}}/>
            </div>
            <div style={{padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={{fontSize:"14px", fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:"11px", color:"#666", marginTop:"4px"}}>Instant Download • Lifetime</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:"16px"}}>{p.price}</div>
                <div style={{fontSize:"10px", color:"#666", marginTop:"4px"}}>BUY →</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div style={{textAlign:"center", padding:"80px 20px"}}>
        <h2 style={{fontSize:"24px", letterSpacing:"4px"}}>WANT EVERYTHING?</h2>
        <p style={{color:"#666", fontSize:"13px", marginTop:"10px"}}>415 files for $497.50 — lifetime access</p>
        <a href="https://buy.stripe.com/5kQfZh6fOcJNgII5dF18d2L" target="_blank" style={{display:"inline-block", marginTop:"24px", background:"white", color:"black", padding:"16px 40px", fontWeight:700, textDecoration:"none", letterSpacing:"2px"}}>GET ALL ACCESS — $497.50</a>
        <div style={{marginTop:"40px", color:"#222", fontSize:"10px", letterSpacing:"3px"}}>© DEZ REBEL // ONE FILE ONLY // DEZ-STORE.VERCEL.APP</div>
      </div>
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
