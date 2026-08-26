import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:"24px", fontFamily:"monospace"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1 style={{letterSpacing:"6px", fontSize:"32px"}}>DEZ REBEL</h1>
        <div style={{border:"1px solid white", padding:"8px 16px"}}>CART (0)</div>
      </div>

      <p style={{color:"#888", marginTop:"10px"}}>GREMLIN HORDE // DEZ ONE FILE ONLY — LIVE DROP</p>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:"20px", marginTop:"40px"}}>
        {[
          {name:"REBEL GREMLIN TEE", price:"$45"},
          {name:"HORDE HOODIE", price:"$85"},
          {name:"DEZ ONE FILE ONLY", price:"$120"},
          {name:"FACeless AUTOMATION PACK", price:"$199"},
        ].map((p,i)=>(
          <div key={i} style={{border:"1px solid #222", padding:"16px"}}>
            <div style={{height:"220px", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", color:"#444"}}>IMAGE</div>
            <h3 style={{marginTop:"12px"}}>{p.name}</h3>
            <p style={{color:"#aaa"}}>{p.price}</p>
            <button style={{width:"100%", marginTop:"12px", padding:"12px", background:"white", color:"black", fontWeight:"bold", border:"none"}}>ADD TO CART</button>
          </div>
        ))}
      </div>

      <div style={{marginTop:"80px", borderTop:"1px solid #222", paddingTop:"20px", color:"#666"}}>
        <p>deployment: {new Date().toLocaleString()} — rebel-ai/dez-store — Ready</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
