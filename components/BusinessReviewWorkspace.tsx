"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, ChevronRight, CircleUserRound, ExternalLink, Eye, FileText, MapPin, RefreshCw, Search, ShieldCheck, ThumbsUp, X, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const human=(s:string)=>s.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());
const niceDate=(v:any)=>{if(!v)return "—";const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})};

export default function BusinessReviewWorkspace(){
 const [me,setMe]=useState<any>(null),[allowed,setAllowed]=useState(false),[loading,setLoading]=useState(true),[rows,setRows]=useState<any[]>([]),[profiles,setProfiles]=useState<any[]>([]),[selected,setSelected]=useState<any|null>(null),[q,setQ]=useState(""),[filter,setFilter]=useState("pending"),[message,setMessage]=useState("");
 const load=useCallback(async()=>{
  setLoading(true);
  const {data:{user}}=await supabase.auth.getUser();setMe(user);
  if(!user){setAllowed(false);setLoading(false);return}
  const {data:roles}=await supabase.from("user_roles").select("role").eq("user_id",user.id);
  const ok=(roles||[]).some((r:any)=>["admin","moderator","verification"].includes(r.role));setAllowed(ok);
  if(!ok){setLoading(false);return}
  const [br,pr]=await Promise.all([
   supabase.from("businesses").select("*,business_categories(name),business_subcategories(name),business_plans(name,badge,monthly_price,annual_price)").order("created_at",{ascending:false}),
   supabase.from("profiles").select("*")
  ]);
  setRows(br.data||[]);setProfiles(pr.data||[]);setLoading(false);
 },[]);
 useEffect(()=>{load()},[load]);
 const profileMap=useMemo(()=>Object.fromEntries(profiles.map(p=>[p.id,p])),[profiles]);
 const ownerFor=(r:any)=>profileMap[r.owner_user_id]||null;
 const status=(r:any)=>String(r.status||"pending").toLowerCase();
 const filtered=rows.filter(r=>{
  const s=status(r);if(filter!=="all"&&s!==filter)return false;
  const o=ownerFor(r);const hay=JSON.stringify([r.name,r.city,r.state,r.email,r.phone,o?.full_name,o?.email]).toLowerCase();return !q||hay.includes(q.toLowerCase());
 });
 async function act(r:any,next:"approved"|"rejected"|"pending"){
  const {error}=await supabase.from("businesses").update({status:next}).eq("id",r.id);
  setMessage(error?.message||`Business ${human(next)}.`);
  if(!error){setSelected({...r,status:next});await load()}
 }
 if(loading)return <main className="review-loading"><RefreshCw className="spin"/><strong>Loading business review queue…</strong></main>;
 if(!me)return <main className="review-denied"><ShieldCheck/><h1>Staff sign-in required</h1><Link href="/admin">Open Admin Login</Link></main>;
 if(!allowed)return <main className="review-denied"><XCircle/><h1>Access denied</h1><p>Administrator, Moderator or Verification access is required.</p></main>;
 return <main className="review-page">
  <div className="review-top"><div><Link href="/admin"><ArrowLeft size={15}/>Admin</Link><small>BUSINESS MODERATION</small><h1>Business Listing Review</h1><p>Inspect every listing before it becomes visible on the public directory.</p></div><button onClick={load}><RefreshCw size={15}/>Refresh</button></div>
  <div className="review-kpis"><article><Eye/><span>Pending review</span><strong>{rows.filter(r=>status(r)==="pending").length}</strong></article><article><CheckCircle2/><span>Approved / live</span><strong>{rows.filter(r=>status(r)==="approved").length}</strong></article><article><XCircle/><span>Rejected</span><strong>{rows.filter(r=>status(r)==="rejected").length}</strong></article></div>
  <section className="review-shell"><aside className="review-queue"><div className="review-tools"><label><Search size={15}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search businesses…"/></label><div className="review-filters">{["pending","approved","rejected","all"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{human(x)}</button>)}</div></div><div className="review-list">{filtered.map(r=>{const o=ownerFor(r);return <button key={r.id} className={selected?.id===r.id?"selected":""} onClick={()=>setSelected(r)}><div className="review-avatar"><BriefcaseBusiness/></div><div><strong>{r.name}</strong><span>{o?.full_name||r.contact_person||r.email||"Business owner"}</span><small>{niceDate(r.created_at)}</small></div><em className={`status ${status(r)}`}>{human(status(r))}</em><ChevronRight size={16}/></button>})}{!filtered.length&&<div className="review-empty">No businesses match this view.</div>}</div></aside>
  <section className="review-detail">{selected?<BusinessDetail row={selected} owner={ownerFor(selected)} act={act}/>:<div className="review-select-empty"><Eye/><h2>Select a business</h2><p>Open a listing to inspect its business details, media, contact information, plan and owner before approving it.</p></div>}</section></section>
  {message&&<div className="review-toast">{message}<button onClick={()=>setMessage("")}><X size={14}/></button></div>}
 </main>
}

function BusinessDetail({row,owner,act}:{row:any;owner:any;act:(r:any,s:"approved"|"rejected"|"pending")=>void}){
 const photos=Array.isArray(row.photos)?row.photos.filter(Boolean):[];
 const fields=[
  ["Category",row.business_categories?.name],["Subcategory",row.business_subcategories?.name],["Plan",row.business_plans?.name],["Contact person",row.contact_person],["Email",row.email],["Phone",row.phone],["WhatsApp",row.whatsapp],["Website",row.website],["Address",row.address],["City",row.city],["State",row.state],["PIN code",row.pincode],["Services",Array.isArray(row.services)?row.services.join(", "):row.services],["Opening hours",row.opening_hours?JSON.stringify(row.opening_hours,null,2):null],["Additional information",row.additional_info]
 ].filter(([,v])=>v!==null&&v!==undefined&&v!=="");
 return <div className="review-detail-inner"><header><div><small>BUSINESS LISTING</small><h2>{row.name}</h2><div className="review-meta"><span className={`status ${String(row.status||"pending").toLowerCase()}`}>{human(String(row.status||"pending"))}</span><span>{niceDate(row.created_at)}</span></div></div></header>
 {photos.length>0&&<section className="review-media"><div className="review-section-title"><BriefcaseBusiness/><div><h3>Submitted gallery</h3><p>Review the imagery that will appear on the public profile.</p></div></div><div className="review-media-grid">{photos.map((src:string,i:number)=><article key={`${src}-${i}`}><img src={src} alt={`${row.name} ${i+1}`}/><footer><span>Photo {i+1}</span><a href={src} target="_blank" rel="noreferrer"><ExternalLink size={13}/>Open original</a></footer></article>)}</div></section>}
 <div className="review-two-col"><section className="review-card"><div className="review-section-title"><CircleUserRound/><div><h3>Owner account</h3><p>Who submitted this business</p></div></div><dl><div><dt>Name</dt><dd>{owner?.full_name||row.contact_person||"—"}</dd></div><div><dt>Email</dt><dd>{owner?.email||row.email||"—"}</dd></div><div><dt>Phone</dt><dd>{owner?.mobile||owner?.phone||row.phone||"—"}</dd></div></dl></section><section className="review-card"><div className="review-section-title"><MapPin/><div><h3>Public listing summary</h3><p>Core information customers will see</p></div></div><dl><div><dt>Location</dt><dd>{[row.city,row.state].filter(Boolean).join(", ")||"—"}</dd></div><div><dt>Featured</dt><dd>{row.is_featured?"Yes":"No"}</dd></div><div><dt>Slug</dt><dd>{row.slug}</dd></div></dl></section></div>
 <section className="review-card"><div className="review-section-title"><FileText/><div><h3>Business description</h3><p>Review the public copy and service claims.</p></div></div><p style={{whiteSpace:"pre-wrap",fontSize:12,lineHeight:1.6}}>{row.description||"No description supplied."}</p></section>
 <section className="review-card"><div className="review-section-title"><FileText/><div><h3>Complete listing data</h3><p>Verify contact, plan and operational details.</p></div></div><div className="review-fields">{fields.map(([k,v]:any)=><div key={k}><span>{k}</span><strong>{String(v)}</strong></div>)}</div></section>
 <div className="review-actions"><div><strong>Publication decision</strong><span>Only Approved businesses are returned by the public directory and public business detail route.</span></div><div><button className="approve" onClick={()=>act(row,"approved")}><ThumbsUp size={15}/>Approve & Publish</button><button onClick={()=>act(row,"pending")}><Eye size={15}/>Keep Pending</button><button className="reject" onClick={()=>act(row,"rejected")}><XCircle size={15}/>Reject</button></div></div></div>
}
