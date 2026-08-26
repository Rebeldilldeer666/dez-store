import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

const PRODUCTS = [
  { id: 1, name: "REBEL GREMLIN TEE - STOIC", price: 45, img: "/dez-stoic.png", desc: "Exact Dez Character" },
  { id: 2, name: "REBEL GREMLIN TEE - LAUGHING", price: 45, img: "/dez-laughing.png", desc: "Exact Dez Character" },
  { id: 3, name: "HORDE HOODIE", price: 85, img: "/dez-stoic.png", desc: "GREMLIN HORDE EDITION" },
  { id: 4, name: "DEZ ONE FILE ONLY PACK", price: 199, img: "/dez-laughing.png", desc: "415 VAULT" },
]

function App(){
  const [cart, setCart] = useState([])
  const [open, setOpen] = useState(false)
  const add = (p) => {
    setCart(prev => {
      const f = prev.find(i=>i.id===p.id)
      if(f) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i)
      return [...prev, {...p, qty:1}]
    })
    setOpen(true)
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const count = cart.reduce((s,i)=>s+i.qty,0)

  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",fontFamily:"monospace"}}>
      <header style={{display:"flex",justifyContent:"space-between",padding:"20px",borderBottom:"1px solid #222",position:"sticky",top:0,background:"black",zIndex:10}}>
        <h1 style={{letterSpacing:"8px",margin:0}}>DEZ REBEL</h1>
        <button onClick={()=>setOpen(!open)} style={{border:"1px solid white",background:"black",color:"white",padding:"10px 20px"}}>CART ({count})</button>
      </header>
      <div style={{padding:"20px",color:"#888"}}>GREMLIN HORDE // DEZ ONE FILE ONLY — LIVE DROP // bb1375c</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"20px",padding:"20px"}}>
        {PRODUCTS.map(p=>(
          <div key={p.id} style={{border:"1px solid #222"}}>
            <div style={{height:"380px",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",padding:"10px"}}/>
            </div>
            <div style={{padding:"16px"}}>
              <h3 style={{margin:"0 0 4px 0",fontSize:"14px"}}>{p.name}</h3>
              <p style={{margin:"0 0 8px 0",color:"#666",fontSize:"11px"}}>{p.desc}</p>
              <p style={{margin:"0 0 12px 0"}}>${p.price}</p>
              <button onClick={()=>add(p)} style={{width:"100%",padding:"14px",background:"white",color:"black",fontWeight:"bold",border:"none"}}>ADD TO CART</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div style={{position:"fixed",right:0,top:0,width:"100%",maxWidth:"400px",height:"100vh",background:"#0a0a0a",borderLeft:"1px solid #333",padding:"20px",zIndex:20,overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><h2>CART</h2><button onClick={()=>setOpen(false)} style={{background:"transparent",color:"white",border:"1px solid #333",padding:"6px 12px"}}>CLOSE</button></div>
          {cart.length===0 && <p style={{color:"#666",marginTop:"40px"}}>Empty. Add some heat.</p>}
          {cart.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",marginTop:"20px",borderBottom:"1px solid #222",paddingBottom:"10px"}}><div>{i.name} x{i.qty}</div><div>${i.price*i.qty}</div></div>)}
          {cart.length>0 && <>
            <div style={{marginTop:"30px",display:"flex",justifyContent:"space-between",fontSize:"20px"}}><span>TOTAL</span><span>${total}</span></div>
            <button style={{width:"100%",marginTop:"20px",padding:"16px",background:"white",color:"black",fontWeight:"bold",border:"none"}}>CHECKOUT — ${total}</button>
            <button onClick={()=>setCart([])} style={{width:"100%",marginTop:"10px",padding:"12px",background:"transparent",color:"#666",border:"1px solid #222"}}>CLEAR</button>
          </>}
        </div>
      )}
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
