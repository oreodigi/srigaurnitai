"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function BusinessInquiryForm({ businessId, businessName }: { businessId: string; businessName: string }) {
  const [message,setMessage]=useState("");
  const [sending,setSending]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setSending(true); setMessage("");
    const f=new FormData(e.currentTarget);
    const {data:{user}}=await supabase.auth.getUser();
    const {error}=await supabase.from("business_inquiries").insert({business_id:businessId,user_id:user?.id||null,full_name:String(f.get("full_name")||""),phone:String(f.get("phone")||""),email:String(f.get("email")||""),event_date:String(f.get("event_date")||"")||null,message:String(f.get("message")||"")});
    setSending(false);
    if(error) return setMessage(error.message);
    e.currentTarget.reset(); setMessage(`Inquiry sent to ${businessName}.`);
  }
  return <form className="inquiry-form" onSubmit={submit}>
    <input name="full_name" required placeholder="Full name"/><input name="phone" placeholder="Phone number"/>
    <input name="email" type="email" placeholder="Email address"/><input name="event_date" type="date"/>
    <textarea name="message" required placeholder="Tell the business what you need..."/>
    <button className="btn btn-primary" disabled={sending}><Send size={14}/>{sending?"Sending...":"Send Inquiry"}</button>
    {message&&<p className="toast-message" style={{gridColumn:"1/-1"}}>{message}</p>}
  </form>;
}
