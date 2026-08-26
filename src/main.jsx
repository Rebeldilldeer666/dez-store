import React from 'react'
import ReactDOM from 'react-dom/client'
const GUMROAD="https://rebeldilldeer666.gumroad.com/l/dez-415-vault-all-access"
const PRODUCTS=[
{id:"01",name:"Snake Line Art Pack",price:14.99,img:"/dez-stoic.png"},
{id:"02",name:"Dark Audio Loops",price:34.99,img:"/dez-laughing.png"},
{id:"03",name:"Tattoo Flash Vault",price:97,img:"/dez-stoic.png"},
{id:"04",name:"Prompt Empire 300",price:147,img:"/dez-laughing.png"},
{id:"05",name:"FULL 415 VAULT",price:497.5,img:"/dez-stoic.png",featured:true},
]
function App(){
 return(
  <div style={{background:"#050505",color:"white",minHeight:"100vh",fontFamily:"sans-serif"}}>
   <header style={{display:"flex",justifyContent:"space-between",padding:"20px",borderBottom:"1px solid #111",position:"sticky",top:0,background:"#050505",zIndex:10}}>
    <div style={{letterSpacing:"10px",fontWeight:700}}>DEZ REBEL</div>
    <a href={GUMROAD} className="gumroad-button" style={{background:"white",color:"black",padding:"10px 16px",textDecoration:"none",fontSize:"11px",fontWeight:700}}>BUY NOW →</a>
   </header>
   <div style={{padding:"50px 24px",maxWidth:"1200px",margin:"0 auto"}}>
    <h1 style={{fontSize:"60px",lineHeight:.9}}>REBEL<br/>GREMLIN<br/>EMPIRE.</h1>
    <p style={{color:"#777",marginTop:"14px",maxWidth:"400px"}}>415 tools. One vault. Instant auto-delivery via Gumroad.</p>
    <a href={GUMROAD} className="gumroad-button" style={{display:"inline-block",marginTop:"20px",background:"white",color:"black",padding:"14px 28px",fontWeight:700,textDecoration:"none"}}>GET VAULT $497.50</a>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1px",background:"#111",borderTop:"1px solid #111",borderBottom:"1px solid #111",maxWidth:"1200px",margin:"0 auto"}}>
    {PRODUCTS.map(p=>(
     <a key={p.id} href={GUMROAD} className="gumroad-button" style={{background:"black",color:"white",textDecoration:"none",display:"block",border:"1px solid #111"}}>
      <div style={{height:"360px",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(circle,#1a1a1a 0%,#050505 70%)"}}>
       <img src={p.img} style={{width:"80%",height:"80%",objectFit:"contain"}} onError={e=>e.target.style.display='none'} />
      </div>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between"}}>
       <div style={{fontWeight:700,fontSize:"13px"}}>{p.name}</div><div style={{fontWeight:700}}>${p.price}</div>
      </div>
     </a>
    ))}
   </div>
   <div style={{textAlign:"center",padding:"30px",color:"#444",fontSize:"11px"}}>dez-store.vercel.app → {GUMROAD} • {PRODUCTS.length} products • no white page</div>
  </div>
 )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
