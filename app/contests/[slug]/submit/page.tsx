"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { LockKeyhole, UploadCloud } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MuxVideoUploader from "@/components/MuxVideoUploader";

export default function ContestSubmitPage(){
 const params=useParams<{slug:string}>();
 const slug=params.slug;
 const [contest,setContest]=useState<any>(null);
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const [videoUrl,setVideoUrl]=useState("");
 const [user,setUser]=useState<any>(null);
 const [authLoading,setAuthLoading]=useState(true);

 useEffect(()=>{
  supabase.from("contests").select("id,title,participation_fee,terms").eq("slug",slug).eq("is_active",true).maybeSingle().then(({data})=>setContest(data));
  supabase.auth.getUser().then(({data})=>{setUser(data.user||null);setAuthLoading(false)});
  const {data}=supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user||null);setAuthLoading(false)});
  return()=>data.subscription.unsubscribe();
 },[slug]);

 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setMessage("");
  if(!user){setBusy(false);setMessage("Please login before submitting.");return}
  if(!contest){setBusy(false);setMessage("Contest could not be loaded.");return}
  if(!videoUrl){setBusy(false);setMessage("Please upload your contest video before submitting.");return}
  const fd=new FormData(e.currentTarget);
  const title=String(fd.get("title")||"");
  const description=String(fd.get("description")||"");
  const accepted=fd.get("terms")==="on";
  if(!accepted){setBusy(false);setMessage("Please accept the contest rules and terms.");return}
  const {data,error}=await supabase.from("contest_submissions").insert({contest_id:contest.id,user_id:user.id,title,description,video_url:videoUrl,status:"submitted",terms_accepted:true}).select("reference_code").single();
  setBusy(false);
  if(error)setMessage(error.message);else{setMessage(`Submitted successfully. Reference ID: ${data.reference_code}. Track it from My Account.`);(e.currentTarget as HTMLFormElement).reset();setVideoUrl("")}
 }

 if(authLoading)return <div className="page"><div className="section-head"><div><h2>Submit Contest Video</h2><p>{contest?.title||slug.replaceAll("-"," ")}</p></div></div><div className="form-card"><div className="inline-loading">Checking your account…</div></div></div>;

 if(!user)return <div className="page"><div className="section-head"><div><h2>Submit Contest Video</h2><p>{contest?.title||slug.replaceAll("-"," ")}</p></div></div><section className="form-card" style={{textAlign:"center",padding:"34px 24px"}}><div style={{width:62,height:62,borderRadius:18,display:"grid",placeItems:"center",margin:"0 auto 16px",background:"#fff1e6",color:"#7b0b3b"}}><LockKeyhole size={29}/></div><h3 style={{margin:"0 0 8px",fontSize:24,color:"#5d082d"}}>Login required to participate</h3><p style={{margin:"0 auto 20px",maxWidth:520,lineHeight:1.6,color:"#74666c"}}>Please login or create your Sri Gaur Nitai account before uploading a contest video. Video upload and submission controls will unlock after you sign in.</p><div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><Link className="btn btn-primary" href="/account">Login / Register</Link><Link className="btn soft-btn" href={`/contests/${slug}`}>Back to Contest</Link></div></section></div>;

 return <div className="page"><div className="section-head"><div><h2>Submit Contest Video</h2><p>{contest?.title||slug.replaceAll("-"," ")}</p></div></div><form className="form-card" onSubmit={submit}><UploadCloud size={30}/><div className="field"><label>Video title</label><input name="title" required placeholder="Enter your video title"/></div><div className="field"><label>Description</label><textarea name="description" rows={4} placeholder="Tell us about this submission"/></div><MuxVideoUploader value={videoUrl} onChange={setVideoUrl} disabled={busy} label="Contest video"/><div className="field"><label className="check-row"><input name="terms" type="checkbox"/> I accept the contest rules and terms.</label></div><button className="btn btn-primary" disabled={busy||!videoUrl}>{busy?"Submitting…":"Submit Entry"}</button><Link className="btn soft-btn" href="/account#contests">My Submissions</Link>{message&&<div className="auth-message">{message}</div>}</form></div>;
}
