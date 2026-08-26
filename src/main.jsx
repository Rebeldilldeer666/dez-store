import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [cart, setCart] = useState(0)
  const products = [
    {name:"REBEL GREMLIN TEE", price:45},
    {name:"HORDE HOODIE", price:85},
    {name:"DEZ ONE FILE ONLY", price:120},
    {name:"FACeless AUTOMATION PACK", price:199},
  ]
  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:"24px", fontFamily:"monospace"}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <h1 style={{letterSpacing:"6px"}}>DEZ REBEL</h1>
        <div style={{border:"1px solid white", padding:"8px 16px"}}>CART ({cart})</div>
      </div>
      <p style={{color:"#888"}}>GREMLIN HORDE // DEZ ONE FILE ONLY — LIVE DROP</p>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"20px", marginTop:"40px"}}>
        {products.map((p,i)=>(
          <div key={i} style={{border:"1px solid #222", padding:"16px"}}>
            <div style={{height:"220px", background:"#111"}}></div>
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={()=>setCart(cart+1)} style={{width:"100%", padding:"12px", background:"white", color:"black", fontWeight:"bold", border:"none"}}>ADD TO CART</button>
          </div>
        ))}
      </div>
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
