"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, KeyRound, Mail, MessageSquareText, Save, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BrandIcon } from "@/components/BrandLogo";

const defaults={
  email_password_enabled:true,
  email_otp_enabled:true,
  sms_login_enabled:false,
  sms_signup_enabled:false,
  require_email_verification:true,
  require_phone_verification:false,
};

export default function AuthenticationSettingsPage(){
  const [checking,setChecking]=useState(true);
  const [admin,setAdmin]=useState(false);
  const [form,setForm]=useState(defaults);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){setChecking(false);return}
    const {data:role}=await supabase.from("user_roles").select("role").eq("user_id",user.id).eq("role","admin").maybeSingle();
    setAdmin(!!role);
    if(role){
      const {data}=await supabase.from("integration_configs").select("public_config").eq("provider","authentication").maybeSingle();
      setForm({...defaults,...(data?.public_config||{})});
    }
    setChecking(false);
  })()},[]);

  async function save(){
    setBusy(true);setMessage("Saving authentication settings…");
    const {data,error}=await supabase.functions.invoke("admin-integrations",{body:{action:"save",provider:"authentication",enabled:true,mode:"production",config:form,secrets:{}}});
    setMessage(error?.message||data?.error||"Authentication settings saved.");
    setBusy(false);
  }

  const toggle=(key:keyof typeof defaults)=><button type="button" className={`auth-setting-switch ${form[key]?"on":""}`} onClick={()=>setForm(v=>({...v,[key]:!v[key]}))}><span/><strong>{form[key]?"ON":"OFF"}</strong></button>;

  if(checking)return <div className="admin-auth-cover"><div className="ma-loader"><BrandIcon size={110}/><strong>Loading Authentication</strong><span><i/></span></div></div>;
  if(!admin)return <div className="admin-auth-cover"><div className="admin-auth-card"><BrandIcon size={90}/><h1>Admin access required</h1><Link href="/admin">Return to Admin</Link></div></div>;

  return <main style={{minHeight:"100vh",background:"#f6f7fb",padding:"24px"}}><div style={{maxWidth:1080,margin:"0 auto"}}>
    <header className="admin-section-header"><div><Link href="/admin/settings" className="back-link"><ChevronLeft size={16}/> Settings</Link><h1>Authentication</h1><p>Control which sign-in and registration methods are available to users.</p></div><div className="secure-pill"><ShieldCheck size={15}/> Admin controlled</div></header>

    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(310px,1fr))",gap:16,marginTop:18}}>
      <article className="integration-card"><div className="integration-title"><div><h2><Mail size={20}/> Email authentication</h2><p>Primary account access and verification.</p></div></div>
        <div className="auth-setting-row"><div><strong>Email + password</strong><small>Allow normal password login.</small></div>{toggle("email_password_enabled")}</div>
        <div className="auth-setting-row"><div><strong>Email OTP login</strong><small>Allow passwordless email OTP access.</small></div>{toggle("email_otp_enabled")}</div>
        <div className="auth-setting-row"><div><strong>Email verification on signup</strong><small>Require new users to verify their email.</small></div>{toggle("require_email_verification")}</div>
      </article>

      <article className="integration-card"><div className="integration-title"><div><h2><MessageSquareText size={20}/> SMS authentication</h2><p>Keep disabled until a Supabase-supported SMS provider is configured.</p></div></div>
        <div className="auth-setting-row"><div><strong>SMS login</strong><small>Show “Login with Phone OTP”.</small></div>{toggle("sms_login_enabled")}</div>
        <div className="auth-setting-row"><div><strong>SMS signup / registration</strong><small>Allow new accounts to start with mobile OTP.</small></div>{toggle("sms_signup_enabled")}</div>
        <div className="auth-setting-row"><div><strong>Require phone verification</strong><small>Reserved for workflows requiring verified mobile numbers.</small></div>{toggle("require_phone_verification")}</div>
      </article>
    </section>

    <div className="integration-note" style={{marginTop:16}}><KeyRound size={16}/><strong> Recommended:</strong> keep email/password and email OTP enabled. Leave SMS OFF until an SMS provider is configured in Supabase Auth; otherwise phone OTP requests will fail.</div>
    <button className="admin-primary" style={{marginTop:16}} onClick={save} disabled={busy}><Save size={16}/>{busy?"Saving…":"Save Authentication Settings"}</button>
    {message&&<p className="admin-message">{message}</p>}
  </div>
  <style jsx>{`.auth-setting-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid #eee5e9}.auth-setting-row:first-of-type{border-top:0}.auth-setting-row div{display:flex;flex-direction:column;gap:4px}.auth-setting-row small{font-size:11px;color:#806f77}.auth-setting-switch{border:0;border-radius:999px;background:#e7e1e4;padding:4px 8px 4px 4px;display:flex;align-items:center;gap:7px;min-width:74px;cursor:pointer}.auth-setting-switch span{width:24px;height:24px;border-radius:50%;background:white;box-shadow:0 2px 7px rgba(0,0,0,.16)}.auth-setting-switch strong{font-size:10px;color:#7c6872}.auth-setting-switch.on{background:#6f0a36}.auth-setting-switch.on strong{color:white}`}</style>
  </main>;
}
