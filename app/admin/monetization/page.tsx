"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, IndianRupee, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BrandIcon } from "@/components/BrandLogo";

export default function MonetizationSettingsPage(){
  const [checking,setChecking]=useState(true);
  const [admin,setAdmin]=useState(false);
  const [freeMode,setFreeMode]=useState(true);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");

  async function load(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){setChecking(false);return}
    const {data:role}=await supabase.from("user_roles").select("role").eq("user_id",user.id).eq("role","admin").maybeSingle();
    setAdmin(!!role);
    if(role){
      const {data}=await supabase.from("integration_configs").select("public_config").eq("provider","monetization").maybeSingle();
      setFreeMode(data?.public_config?.free_mode!==false);
    }
    setChecking(false);
  }

  useEffect(()=>{load()},[]);

  async function setMode(next:boolean){
    setBusy(true);setMessage(next?"Turning all user services free…":"Restoring paid-service pricing…");
    const {data,error}=await supabase.rpc("set_platform_free_mode",{p_free:next});
    if(error){setMessage(error.message);setBusy(false);return}
    setFreeMode(next);
    setMessage(next?"Free Mode is active. Contest entry, event publishing and business plans are free.":"Paid Mode restored previous saved prices. Re-enable your payment provider separately if required.");
    setBusy(false);
  }

  if(checking)return <div className="admin-auth-cover"><div className="ma-loader"><BrandIcon size={110}/><strong>Loading Monetization</strong><span><i/></span></div></div>;
  if(!admin)return <div className="admin-auth-cover"><div className="admin-auth-card"><BrandIcon size={90}/><h1>Admin access required</h1><Link href="/admin">Return to Admin</Link></div></div>;

  return <main style={{minHeight:"100vh",background:"#f6f7fb",padding:"24px"}}><div style={{maxWidth:980,margin:"0 auto"}}>
    <header className="admin-section-header"><div><Link href="/admin/settings" className="back-link"><ChevronLeft size={16}/> Settings</Link><h1>Monetization</h1><p>Turn every user-facing paid service on or off from one control.</p></div><div className="secure-pill"><ShieldCheck size={15}/> Admin controlled</div></header>

    <section style={{marginTop:18,border:"1px solid #e6dde2",borderRadius:22,background:"white",padding:24,boxShadow:"0 10px 30px rgba(48,25,37,.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{maxWidth:620}}><div style={{width:48,height:48,borderRadius:15,display:"grid",placeItems:"center",background:freeMode?"#ecf8ef":"#fff1f5",color:freeMode?"#177a3d":"#861044"}}><IndianRupee size={23}/></div><h2 style={{margin:"16px 0 6px"}}>{freeMode?"Free Mode is ON":"Paid Mode is ON"}</h2><p style={{margin:0,color:"#76656e",lineHeight:1.6}}>Free Mode sets all contest participation fees, event service prices, publishing-package charges and business-plan fees to zero. Previous prices are backed up privately and can be restored later.</p></div>
        <button type="button" onClick={()=>setMode(!freeMode)} disabled={busy} style={{border:0,borderRadius:999,padding:"13px 20px",fontWeight:900,cursor:"pointer",background:freeMode?"#6f0a36":"#16763b",color:"white",minWidth:210}}>{busy?"Updating…":freeMode?"Turn Paid Services ON":"Make Everything FREE"}</button>
      </div>
      <div style={{marginTop:22,padding:16,borderRadius:16,background:freeMode?"#f0faf3":"#fff8ed",color:freeMode?"#175d34":"#72551d",display:"flex",gap:10,alignItems:"flex-start"}}><Sparkles size={18} style={{marginTop:2}}/><div><strong>{freeMode?"Users are not charged":"Paid pricing is enabled"}</strong><div style={{fontSize:12,marginTop:4,lineHeight:1.55}}>{freeMode?"Razorpay is disabled while Free Mode is active. Historical payment and prize records are not modified.":"Previous saved service prices have been restored. Payment-provider activation remains a separate admin decision."}</div></div></div>
    </section>
    {message&&<p className="admin-message" style={{marginTop:16}}>{message}</p>}
  </div></main>;
}
