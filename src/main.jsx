import React from 'react'
import ReactDOM from 'react-dom/client'
const GUMROAD="https://rebeldilldeer666.gumroad.com/l/dez-415-vault-all-access"
const HERO="/dez-sharp.png"
function App(){
 return(
  <div style={{background:"#050505",color:"white",minHeight:"100vh",fontFamily:"sans-serif"}}>
   <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:"1px solid #111",position:"sticky",top:0,background:"#050505",zIndex:10}}>
    <div style={{letterSpacing:"8px",fontWeight:800,fontSize:"14px"}}>DEZ REBEL</div>
    <a href={GUMROAD} target="_blank" style={{background:"white",color:"black",padding:"12px 20px",textDecoration:"none",fontSize:"12px",fontWeight:800,borderRadius:"6px"}}>BUY NOW → $497.50</a>
   </header>
   <div style={{display:"flex",flexWrap:"wrap",maxWidth:"1200px",margin:"0 auto",minHeight:"560px"}}>
    <div style={{flex:"1 1 360px",padding:"60px 24px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
     <h1 style={{fontSize:"clamp(48px,9vw,88px)",lineHeight:.85,letterSpacing:"-3px",fontWeight:900}}>REBEL<br/>GREMLIN<br/>EMPIRE.</h1>
     <p style={{color:"#777",marginTop:"16px",maxWidth:"420px",fontSize:"14px",lineHeight:1.6}}>415 tools. One vault. Instant auto-delivery via Gumroad.</p>
     <a href={GUMROAD} target="_blank" style={{display:"inline-block",marginTop:"24px",background:"white",color:"black",padding:"16px 32px",fontWeight:900,textDecoration:"none",fontSize:"13px",borderRadius:"6px",width:"fit-content"}}>GET VAULT $497.50 →</a>
    </div>
    <div style={{flex:"1 1 360px",minHeight:"560px",backgroundColor:"#0a0a0a",borderLeft:"1px solid #111",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
     <img src={HERO} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.src="/dez-stoic.png"}} />
    </div>
   </div>
  </div>
 )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
