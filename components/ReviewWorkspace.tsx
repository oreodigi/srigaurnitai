"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, ChevronRight, CircleUserRound, ExternalLink, Eye, FileText, Image as ImageIcon, PlayCircle, RefreshCw, Search, ShieldCheck, ThumbsUp, Video, X, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Mode="contest"|"event";
const human=(s:string)=>s.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());
const isUrl=(v:any)=>typeof v==="string"&&/^https?:\/\//i.test(v);
const isImage=(v:string)=>/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(v)||/image|photo|thumbnail|poster|banner|cover/i.test(v);
const isVideo=(v:string,k:string)=>/\.(mp4|webm|mov|m4v)(\?|$)/i.test(v)||/video|mux|youtube|youtu\.be|vimeo/i.test(k+" "+v);
const niceDate=(v:any)=>{if(!v)return "—";const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})};

export default function ReviewWorkspace({mode}:{mode:Mode}){
 const table=mode==="contest"?"contest_submissions":"event_submissions";
 const [me,setMe]=useState<any>(null),[allowed,setAllowed]=useState(false),[loading,setLoading]=useState(true),[rows,setRows]=useState<any[]>([]),[profiles,setProfiles]=useState<any[]>([]),[contexts,setContexts]=useState<any[]>([]),[selected,setSelected]=useState<any|null>(null),[q,setQ]=useState(""),[filter,setFilter]=useState("pending"),[message,setMessage]=useState("");
 const load=useCallback(async()=>{
   setLoading(true);
   const {data:{user}}=await supabase.auth.getUser(); setMe(user);
   if(!user){setAllowed(false);setLoading(false);return}
   const {data:roles}=await supabase.from("user_roles").select("role").eq("user_id",user.id);
   const ok=(roles||[]).some((r:any)=>["admin","moderator","verification","support"].includes(r.role)); setAllowed(ok);
   if(!ok){setLoading(false);return}
   const [rr,pp,cc]=await Promise.all([
     supabase.from(table).select("*").order("created_at",{ascending:false}),
     supabase.from("profiles").select("*"),
     mode==="contest"?supabase.from("contests").select("*"):supabase.from("event_categories").select("*")
   ]);
   setRows(rr.data||[]);setProfiles(pp.data||[]);setContexts(cc.data||[]);setLoading(false);
 },[mode,table]);
 useEffect(()=>{load()},[load]);
 const profileMap=useMemo(()=>Object.fromEntries(profiles.map(p=>[p.id,p])),[profiles]);
 const contextMap=useMemo(()=>Object.fromEntries(contexts.map(c=>[c.id,c])),[contexts]);
 const contextFor=(r:any)=>contextMap[mode==="contest"?r.contest_id:r.event_category_id]||null;
 const userFor=(r:any)=>profileMap[r.user_id]||null;
 const status=(r:any)=>String(r.status||"submitted").toLowerCase();
 const filtered=rows.filter(r=>{
   const s=status(r); const pending=["submitted","under_review","pending","payment_received"].includes(s);
   if(filter==="pending"&&!pending)return false;if(filter==="approved"&&!(["approved","shortlisted","finalist","winner","scheduled","published"].includes(s)))return false;if(filter==="rejected"&&s!=="rejected")return false;
   const u=userFor(r),c=contextFor(r);const hay=JSON.stringify([r,u?.full_name,u?.email,c?.title,c?.name]).toLowerCase();return !q||hay.includes(q.toLowerCase());
 });
 async function act(r:any,next:string){const patch:any={status:next};if(next==="approved")patch.reviewed_at=new Date().toISOString();const {error}=await supabase.from(table).update(patch).eq("id",r.id);setMessage(error?.message||`Status changed to ${human(next)}.`);if(!error){setSelected({...r,...patch});load()}}
 if(loading)return <main className="review-loading"><RefreshCw className="spin"/><strong>Loading moderation workspace…</strong></main>;
 if(!me)return <main className="review-denied"><ShieldCheck/><h1>Staff sign-in required</h1><Link href="/admin">Open Admin Login</Link></main>;
 if(!allowed)return <main className="review-denied"><XCircle/><h1>Access denied</h1><p>Your staff role does not include moderation access.</p></main>;
 return <main className="review-page">
   <div className="review-top"><div><Link href="/admin"><ArrowLeft size={15}/>Admin</Link><small>{mode==="contest"?"CONTENT MODERATION":"EVENT MODERATION"}</small><h1>{mode==="contest"?"Contest Submission Review":"Event Request Review"}</h1><p>Open each submission, inspect the actual content and customer context, then approve, reject or advance it.</p></div><button onClick={load}><RefreshCw size={15}/>Refresh</button></div>
   <div className="review-kpis"><article><Eye/><span>Needs review</span><strong>{rows.filter(r=>["submitted","under_review","pending","payment_received"].includes(status(r))).length}</strong></article><article><CheckCircle2/><span>Approved / advanced</span><strong>{rows.filter(r=>["approved","shortlisted","finalist","winner","scheduled","published"].includes(status(r))).length}</strong></article><article><XCircle/><span>Rejected</span><strong>{rows.filter(r=>status(r)==="rejected").length}</strong></article></div>
   <section className="review-shell"><aside className="review-queue"><div className="review-tools"><label><Search size={15}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search submissions…"/></label><div className="review-filters">{["pending","approved","rejected","all"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{human(x)}</button>)}</div></div><div className="review-list">{filtered.map(r=>{const u=userFor(r),c=contextFor(r);return <button key={r.id} className={selected?.id===r.id?"selected":""} onClick={()=>setSelected(r)}><div className="review-avatar"><CircleUserRound/></div><div><strong>{u?.full_name||r.name||r.title||"Submission"}</strong><span>{c?.title||c?.name||"General"}</span><small>{niceDate(r.created_at)}</small></div><em className={`status ${status(r)}`}>{human(status(r))}</em><ChevronRight size={16}/></button>})}{!filtered.length&&<div className="review-empty">No submissions match this view.</div>}</div></aside>
   <section className="review-detail">{selected?<SubmissionDetail mode={mode} row={selected} user={userFor(selected)} context={contextFor(selected)} act={act}/>:<div className="review-select-empty"><Eye/><h2>Select a submission</h2><p>Choose an item from the review queue to inspect its media, user information and complete submission data before taking action.</p></div>}</section></section>
   {message&&<div className="review-toast">{message}<button onClick={()=>setMessage("")}><X size={14}/></button></div>}
 </main>
}

function SubmissionDetail({mode,row,user,context,act}:{mode:Mode;row:any;user:any;context:any;act:(r:any,s:string)=>void}){
 const entries=Object.entries(row).filter(([k,v])=>v!==null&&v!==""&&!['id','user_id','contest_id','event_category_id'].includes(k));
 const media=entries.filter(([k,v])=>isUrl(v)&&(isImage(String(v))||isVideo(String(v),k)));
 const details=entries.filter(([k,v])=>!media.some(([mk])=>mk===k)&&!['created_at','updated_at','status'].includes(k));
 return <div className="review-detail-inner">
   <header><div><small>{mode==="contest"?"CONTEST ENTRY":"EVENT REQUEST"}</small><h2>{context?.title||context?.name||row.title||row.name||"Submission details"}</h2><div className="review-meta"><span className={`status ${String(row.status||'submitted').toLowerCase()}`}>{human(String(row.status||"submitted"))}</span><span><CalendarClock size={14}/>{niceDate(row.created_at)}</span></div></div></header>
   {media.length>0&&<section className="review-media"><div className="review-section-title"><PlayCircle/><div><h3>Submitted Content</h3><p>Review the actual uploaded media before moderating.</p></div></div><div className="review-media-grid">{media.map(([k,v]:any)=>{const src=String(v);return <article key={k}>{isImage(src)?<img src={src} alt={human(k)}/>:isVideo(src,k)&&/\.(mp4|webm|mov|m4v)(\?|$)/i.test(src)?<video controls preload="metadata" src={src}/>:<div className="review-external-media"><Video/><strong>{human(k)}</strong><a href={src} target="_blank" rel="noreferrer">Open submitted media <ExternalLink size={14}/></a></div>}<footer><span>{human(k)}</span>{isUrl(src)&&<a href={src} target="_blank" rel="noreferrer"><ExternalLink size={13}/>Open original</a>}</footer></article>})}</div></section>}
   <div className="review-two-col"><section className="review-card"><div className="review-section-title"><CircleUserRound/><div><h3>Submitted by</h3><p>Account and contact context</p></div></div><dl><div><dt>Name</dt><dd>{user?.full_name||row.name||"—"}</dd></div><div><dt>Email</dt><dd>{user?.email||row.email||"—"}</dd></div><div><dt>Phone</dt><dd>{user?.phone||row.phone||"—"}</dd></div><div><dt>City</dt><dd>{user?.city||row.city||"—"}</dd></div></dl></section><section className="review-card"><div className="review-section-title"><FileText/><div><h3>{mode==="contest"?"Contest context":"Event context"}</h3><p>Linked public configuration</p></div></div><dl><div><dt>Title</dt><dd>{context?.title||context?.name||"—"}</dd></div>{context?.description&&<div><dt>Description</dt><dd>{context.description}</dd></div>}{context?.rules&&<div><dt>Rules</dt><dd>{context.rules}</dd></div>}</dl></section></div>
   <section className="review-card"><div className="review-section-title"><FileText/><div><h3>Complete submission data</h3><p>All non-media fields supplied with this record.</p></div></div><div className="review-fields">{details.map(([k,v]:any)=><div key={k}><span>{human(k)}</span><strong>{typeof v==="object"?JSON.stringify(v,null,2):isUrl(v)?<a href={v} target="_blank" rel="noreferrer">{v}<ExternalLink size={12}/></a>:String(v)}</strong></div>)}</div></section>
   <div className="review-actions"><div><strong>Moderation decision</strong><span>Review the submission above before choosing an action.</span></div><div>{mode==="contest"?<><button className="approve" onClick={()=>act(row,"approved")}><ThumbsUp size={15}/>Approve</button><button onClick={()=>act(row,"shortlisted")}><CheckCircle2 size={15}/>Shortlist</button><button className="reject" onClick={()=>act(row,"rejected")}><XCircle size={15}/>Reject</button></>:<><button className="approve" onClick={()=>act(row,"approved")}><ThumbsUp size={15}/>Approve</button><button onClick={()=>act(row,"scheduled")}><CalendarClock size={15}/>Schedule</button><button onClick={()=>act(row,"published")}><CheckCircle2 size={15}/>Publish</button><button className="reject" onClick={()=>act(row,"rejected")}><XCircle size={15}/>Reject</button></>}</div></div>
 </div>
}
