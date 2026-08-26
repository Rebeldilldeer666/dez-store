import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
const IMGS = ["/dez-stoic.png","/dez-laughing.png"]
const CATALOG = "https://rebeldilldeer666.gumroad.com/l/dez-415-vault-all-access"

function App(){
  const [products,setProducts]=useState([])
  useEffect(()=>{fetch("/products.json").then(r=>r.json()).then(d=>setProducts(d.products||[]))},[])
  return (
    <div style={{background:"#050505", color:"white", minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono&display=swap');
        *{box-sizing:border-box;margin:0}
        body{font-family:'Space Grotesk'}
        .mono{font-family:'JetBrains Mono',monospace}
        .card{border:1px solid #111; transition:.2s}
        .card:hover{border-color:white; transform:translateY(-4px)}
        .glow{background:radial-gradient(circle at center,#1a1a1a 0%,#050505 70%)}
      `}</style>
      <header style={{display:"flex", justifyContent:"space-between", padding:"20px 24px", borderBottom:"1px solid #111", position:"sticky", top:0, background:"#050505", zIndex:9}}>
        <div style={{letterSpacing:"10px", fontWeight:700}}>DEZ REBEL</div>
        <a href={CATALOG} target="_blank" className="mono" style={{border:"1px solid white", color:"white", padding:"10px 16px", textDecoration:"none", fontSize:"11px"}}>GUMROAD CATALOG →</a>
      </header>
      <div style={{padding:"60px 24px", maxWidth:"1200px", margin:"0 auto"}}>
        <h1 style={{fontSize:"clamp(40px,8vw,82px)", lineHeight:.85, letterSpacing:"-3px"}}>REBEL<br/>GREMLIN<br/>EMPIRE.</h1>
        <p className="mono" style={{color:"#777", maxWidth:"420px", marginTop:"18px", fontSize:"13px", lineHeight:"1.6"}}>415 tools. One vault. Your Vercel store now delivers via Gumroad auto-delivery. One click, instant ZIP.</p>
        <a href={CATALOG} target="_blank" style={{display:"inline-block", marginTop:"22px", background:"white", color:"black", padding:"14px 28px", fontWeight:700, textDecoration:"none", fontSize:"12px", letterSpacing:"2px"}}>GET FULL VAULT — $497.50</a>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1px", background:"#111", borderTop:"1px solid #111", borderBottom:"1px solid #111", maxWidth:"1200px", margin:"0 auto"}}>
        {products.map((p,i)=>(
          <a key={p.id} href={p.gumroad_link} target="_blank" className="card" style={{background:"black", textDecoration:"none", color:"white"}}>
            <div className="glow" style={{height:"380px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative"}}>
              <span className="mono" style={{position:"absolute", top:"12px", left:"12px", fontSize:"9px", border:"1px solid #222", padding:"4px 6px", color:"#666"}}>{p.id}</span>
              {p.featured && <span className="mono" style={{position:"absolute", top:"12px", right:"12px", background:"white", color:"black", fontSize:"9px", padding:"4px 6px", fontWeight:700}}>ALL ACCESS</span>}
              <img src={IMGS[i%IMGS.length]} style={{width:"85%", height:"85%", objectFit:"contain"}}/>
            </div>
            <div style={{padding:"16px 18px", display:"flex", justifyContent:"space-between"}}>
              <div><div style={{fontWeight:700, fontSize:"13px"}}>{p.name}</div><div className="mono" style={{fontSize:"10px", color:"#555", marginTop:"3px"}}>GUMROAD • INSTANT</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:700}}>${p.price}</div><div className="mono" style={{fontSize:"9px", color:"#666"}}>BUY →</div></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
