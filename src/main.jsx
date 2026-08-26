import React from 'react'
import ReactDOM from 'react-dom/client'
const GUMROAD="https://rebeldilldeer666.gumroad.com/l/dez-415-vault-all-access"
const HERO_IMG="/dez-sharp.png"
const PRODUCTS=[
{id:"01",name:"Snake Line Art Pack",price:14.99,img:"/dez-sharp.png"},
{id:"02",name:"Dark Audio Loops",price:34.99,img:"/dez-sharp.png"},
{id:"03",name:"Tattoo Flash Vault",price:97,img:"/dez-sharp.png"},
{id:"04",name:"Prompt Empire 300",price:147,img:"/dez-sharp.png"},
{id:"05",name:"FULL 415 VAULT",price:497.5,img:"/dez-sharp.png",featured:true},
]
function App(){
 return(
  <div style={{background:"#050505",color:"white",minHeight:"100vh",fontFamily:"sans-serif"}}>
   <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:"1px solid #111",position:"sticky",top:0,background:"#050505",zIndex:10}}>
    <div style={{letterSpacing:"8px",fontWeight:800,fontSize:"14px"}}>DEZ REBEL</div>
    <a href={GUMROAD} className="gumroad-button" style={{background:"white",color:"black",padding:"12px 20px",textDecoration:"none",fontSize:"12px",fontWeight:800,borderRadius:"6px"}}>BUY NOW → $497.50</a>
   </header>
   
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",maxWidth:"1200px",margin:"0 auto",minHeight:"560px"}}>
    <div style={{padding:"50px 24px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
     <h1 style={{fontSize:"clamp(48px,9vw,88px)",lineHeight:.85,letterSpacing:"-3px",fontWeight:900}}>REBEL<br/>GREMLIN<br/>EMPIRE.</h1>
     <p style={{color:"#777",marginTop:"16px",maxWidth:"420px",fontSize:"14px",lineHeight:1.6}}>415 tools. One vault. Instant auto-delivery via Gumroad. Now with sharp 8K Dez hero.</p>
     <a href={GUMROAD} className="gumroad-button" style={{display:"inline-block",marginTop:"24px",background:"white",color:"black",padding:"16px 32px",fontWeight:900,textDecoration:"none",fontSize:"13px",borderRadius:"6px",textAlign:"center",width:"fit-content"}}>GET VAULT $497.50 →</a>
     <div style={{marginTop:"18px",color:"#333",fontSize:"10px",letterSpacing:"2px"}}>415 PRODUCTS • ONE ZIP • INSTANT</div>
    </div>
    <div style={{background:`url(${HERO_IMG}) center/cover no-repeat`,minHeight:"560px",backgroundColor:"#0a0a0a",borderLeft:"1px solid #111"}}></div>
   </div>

   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1px",background:"#111",borderTop:"1px solid #111",borderBottom:"1px solid #111",maxWidth:"1200px",margin:"0 auto"}}>
    {PRODUCTS.map(p=>(
     <a key={p.id} href={GUMROAD} className="gumroad-button" style={{background:"black",color:"white",textDecoration:"none",display:"block"}}>
      <div style={{height:"360px",display:"flex",alignItems:"center",justifyContent:"center",background:`radial-gradient(circle at center, #1a1a1a 0%, #050505 70%)`,overflow:"hidden"}}>
       <img src={p.img} style={{width:"100%",height:"100%",objectFit:"cover"}} />
      </div>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
       <div style={{fontWeight:700,fontSize:"13px"}}>{p.name}</div><div style={{fontWeight:800,background:"white",color:"black",padding:"6px 10px",borderRadius:"4px",fontSize:"12px"}}>${p.price} →</div>
      </div>
     </a>
    ))}
   </div>
  </div>
 )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
