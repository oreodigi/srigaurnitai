"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage(){
  const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();if(password.length<8)return setMessage("Use at least 8 characters.");if(password!==confirm)return setMessage("Passwords do not match.");setBusy(true);const {error}=await supabase.auth.updateUser({password});setBusy(false);setMessage(error?error.message:"Password updated successfully. You can continue to your account.")}
  return <div className="page auth-page"><section className="auth-shell"><div className="auth-intro"><ShieldCheck size={38}/><h1>Create a new password</h1><p>Choose a strong password for your Sri Gaur Nitai account.</p></div><form onSubmit={submit}><div className="field"><label>New password</label><div className="input-icon"><KeyRound/><input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/></div></div><div className="field"><label>Confirm password</label><input type="password" minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)}/></div><button className="btn btn-primary auth-main" disabled={busy}>Update Password</button></form>{message&&<div className="auth-message">{message}</div>}<Link className="text-button" href="/account">Back to Account</Link></section></div>;
}
