"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CalendarHeart, CreditCard, LifeBuoy, Plus, Send, Settings2, Ticket, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

type TicketRow={id:string;ticket_number:string;subject:string;message:string;status:string;priority:string;category:string;related_type?:string|null;related_id?:string|null;created_at:string;updated_at:string;last_reply_at?:string|null};
type RelatedItem={id:string;label:string;detail:string;type:string};

const typeCards=[
 {key:"general",label:"General Support",desc:"Account, platform and general help",icon:LifeBuoy},
 {key:"contest",label:"Contest Support",desc:"Submissions, rules, uploads and results",icon:Trophy},
 {key:"event",label:"Event Support",desc:"Publishing, scheduling and approvals",icon:CalendarHeart},
 {key:"business",label:"Business Support",desc:"Listings, plans and subscriptions",icon:BriefcaseBusiness},
 {key:"payment",label:"Payments & Refunds",desc:"Transactions, invoices and refunds",icon:CreditCard},
 {key:"technical",label:"Technical Issue",desc:"Login, website and upload problems",icon:Settings2},
];

export default function SupportPage(){
 const [user,setUser]=useState<any>(null),[tickets,setTickets]=useState<TicketRow[]>([]),[selected,setSelected]=useState<TicketRow|null>(null),[messages,setMessages]=useState<any[]>([]),[loading,setLoading]=useState(true),[notice,setNotice]=useState("");
 const [category,setCategory]=useState("general"),[subject,setSubject]=useState(""),[message,setMessage]=useState(""),[priority,setPriority]=useState("normal"),[reply,setReply]=useState(""),[relatedId,setRelatedId]=useState("");
 const [related,setRelated]=useState<Record<string,RelatedItem[]>>({contest:[],event:[],business:[],payment:[]});
 const params=useMemo(()=>typeof window!=="undefined"?new URLSearchParams(window.location.search):null,[]);
 async function load(u:any){if(!u){setLoading(false);return}const [t,c,e,b,p]=await Promise.all([
  supabase.from("support_tickets").select("*").eq("user_id",u.id).order("updated_at",{ascending:false}),
  supabase.from("contest_submissions").select("id,reference_code,title,status,contests(title)").eq("user_id",u.id).order("submitted_at",{ascending:false}),
  supabase.from("event_submissions").select("id,reference_code,title,subject_name,status,event_categories(name)").eq("user_id",u.id).order("created_at",{ascending:false}),
  supabase.from("businesses").select("id,name,status,city").eq("owner_user_id",u.id).order("created_at",{ascending:false}),
  supabase.from("payments").select("id,purpose,amount,status,transaction_id,created_at").eq("user_id",u.id).order("created_at",{ascending:false}).limit(50)
 ]);
 setTickets((t.data||[]) as TicketRow[]);
 setRelated({
  contest:(c.data||[]).map((x:any)=>({id:x.id,type:"contest",label:x.contests?.title||x.title||"Contest submission",detail:`${x.reference_code||x.id} • ${x.status}`})),
  event:(e.data||[]).map((x:any)=>({id:x.id,type:"event",label:x.title||x.subject_name||x.event_categories?.name||"Event request",detail:`${x.reference_code||x.id} • ${x.status}`})),
  business:(b.data||[]).map((x:any)=>({id:x.id,type:"business",label:x.name,detail:`${x.city||""}${x.city?" • ":""}${x.status}`})),
  payment:(p.data||[]).map((x:any)=>({id:x.id,type:"payment",label:`₹${Number(x.amount||0).toLocaleString("en-IN")} • ${String(x.purpose||"Payment").replaceAll("_"," ")}`,detail:`${x.transaction_id||new Date(x.created_at).toLocaleDateString("en-IN")} • ${x.status}`}))
 });
 setLoading(false)}
 useEffect(()=>{supabase.auth.getUser().then(({data})=>{setUser(data.user);if(data.user)load(data.user);else setLoading(false);const type=params?.get("type");if(type&&typeCards.some(x=>x.key===type))setCategory(type);const id=params?.get("id");if(id)setRelatedId(id)})},[]);
 useEffect(()=>{if(!["contest","event","business","payment"].includes(category))setRelatedId("")},[category]);
 async function openTicket(t:TicketRow){setSelected(t);const {data}=await supabase.from("support_messages").select("*").eq("ticket_id",t.id).eq("is_internal",false).order("created_at");setMessages(data||[])}
 async function createTicket(e:FormEvent){e.preventDefault();if(!user){location.href="/account";return}setNotice("Creating ticket…");const relatedType=["contest","event","business","payment"].includes(category)?category:null;const {data,error}=await supabase.from("support_tickets").insert({user_id:user.id,subject,message,category,priority,related_type:relatedType,related_id:relatedId||null,requester_name:user.user_metadata?.full_name||null,requester_email:user.email||null,requester_phone:user.phone||null}).select().single();if(error){setNotice(error.message);return}await supabase.from("support_messages").insert({ticket_id:data.id,sender_user_id:user.id,sender_role:"user",message});setSubject("");setMessage("");setRelatedId("");setNotice(`Ticket ${data.ticket_number} created.`);await load(user);openTicket(data as TicketRow)}
 async function sendReply(){if(!selected||!reply.trim()||!user)return;const text=reply.trim();setReply("");await supabase.from("support_messages").insert({ticket_id:selected.id,sender_user_id:user.id,sender_role:"user",message:text});const nextStatus=selected.status==="resolved"||selected.status==="closed"?"open":selected.status;await supabase.from("support_tickets").update({status:nextStatus,last_reply_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",selected.id);const next={...selected,status:nextStatus};setSelected(next);await openTicket(next);await load(user)}
 const relatedOptions=related[category]||[];
 if(!user&&!loading)return <div className="page support-page"><section className="support-login"><LifeBuoy/><h1>Support Center</h1><p>Sign in to create and track support tickets linked to your contests, events, businesses and payments.</p><Link className="btn btn-primary" href="/account">Login to Get Support <ArrowRight size={15}/></Link></section></div>;
 return <div className="page support-page"><section className="support-hero"><div><span>SUPPORT CENTER</span><h1>How can we help?</h1><p>Create a ticket, connect it to the exact record involved, and keep every reply in one conversation.</p></div><div className="support-hero-stat"><Ticket/><strong>{tickets.length}</strong><span>Your tickets</span></div></section>
 <div className="support-layout"><main><section className="support-category-grid">{typeCards.map(({key,label,desc,icon:Icon})=><button className={category===key?"support-category active":"support-category"} key={key} onClick={()=>setCategory(key)}><Icon/><strong>{label}</strong><span>{desc}</span></button>)}</section>
 <form className="support-form" onSubmit={createTicket}><div className="section-head"><div><h2>Create Support Ticket</h2><p>Choose the exact submission, listing or payment whenever applicable.</p></div></div><div className="support-form-grid"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{typeCards.map(x=><option key={x.key} value={x.key}>{x.label}</option>)}</select></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>{["contest","event","business","payment"].includes(category)&&<label className="span-2">Related {category}<select value={relatedId} onChange={e=>setRelatedId(e.target.value)}><option value="">Select a related record</option>{relatedOptions.map(x=><option key={x.id} value={x.id}>{x.label} — {x.detail}</option>)}</select></label>}<label className="span-2">Subject<input required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Briefly describe the issue"/></label><label className="span-2">Message<textarea required rows={6} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Explain what happened, what you expected and any relevant details."/></label></div><button className="btn btn-primary"><Plus size={15}/>Create Ticket</button>{notice&&<span className="support-notice">{notice}</span>}</form></main>
 <aside className="support-ticket-panel"><div className="section-head"><div><h2>My Tickets</h2><p>Latest activity first</p></div></div>{loading?<div className="empty-mini">Loading tickets…</div>:tickets.length?tickets.map(t=><button key={t.id} className={selected?.id===t.id?"support-ticket active":"support-ticket"} onClick={()=>openTicket(t)}><div><strong>{t.subject}</strong><span>{t.ticket_number} • {t.category}</span></div><em className={`status-pill ${t.status}`}>{t.status.replaceAll("_"," ")}</em></button>):<div className="empty-mini">No support tickets yet.</div>}</aside></div>
 {selected&&<div className="support-thread-backdrop" onClick={()=>setSelected(null)}><section className="support-thread" onClick={e=>e.stopPropagation()}><header><div><span>{selected.ticket_number}</span><h2>{selected.subject}</h2><p>{selected.category} • {selected.priority} priority</p></div><button onClick={()=>setSelected(null)}>×</button></header><div className="support-thread-meta"><span>Status <strong>{selected.status}</strong></span><span>Created <strong>{new Date(selected.created_at).toLocaleString("en-IN")}</strong></span>{selected.related_id&&<span>Linked <strong>{selected.related_type}</strong></span>}</div><div className="support-messages">{messages.length?messages.map(m=><article className={m.sender_role==="user"?"support-message user":"support-message staff"} key={m.id}><div><strong>{m.sender_role==="user"?"You":"Sri Gaur Nitai Support"}</strong><span>{new Date(m.created_at).toLocaleString("en-IN")}</span></div><p>{m.message}</p></article>):<div className="empty-mini">No replies yet.</div>}</div><div className="support-reply"><textarea rows={3} value={reply} onChange={e=>setReply(e.target.value)} placeholder="Reply to this ticket…"/><button className="btn btn-primary" onClick={sendReply}><Send size={15}/>Send Reply</button></div></section></div>}
 </div>;
}
