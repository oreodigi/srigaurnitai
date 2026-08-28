import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarHeart, CheckCircle2, Gift, Play, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SocialShare } from "@/components/SocialShare";

const base="https://srigaurnitai.vercel.app";
const fallback="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=85";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const {data:e}=await supabase.from("event_categories").select("name,description,image_url,seo_title,seo_description,seo_keywords,seo_canonical_url,seo_og_title,seo_og_description,seo_og_image_url,seo_noindex").eq("slug",slug).maybeSingle();
 if(!e)return {};
 const title=e.seo_title||`${e.name} Event Video Service`;
 const description=e.seo_description||e.description||`Publish your ${e.name} event video through Sri Gaur Nitai.`;
 const canonical=e.seo_canonical_url||`${base}/events/${slug}`;
 const image=e.seo_og_image_url||e.image_url||undefined;
 return {title,description,keywords:e.seo_keywords||undefined,alternates:{canonical},robots:{index:!e.seo_noindex,follow:true},openGraph:{type:"website",title:e.seo_og_title||title,description:e.seo_og_description||description,url:canonical,images:image?[{url:image}]:undefined},twitter:{card:"summary_large_image",title:e.seo_og_title||title,description:e.seo_og_description||description,images:image?[image]:undefined}};
}

export default async function EventDetailPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const [{data:event},{data:packages},{data:videos}]=await Promise.all([
  supabase.from("event_categories").select("*").eq("slug",slug).eq("is_active",true).maybeSingle(),
  supabase.from("event_packages").select("id,name,description,price_modifier,features,badge").eq("is_active",true).order("sort_order"),
  supabase.from("public_videos").select("id,title,participant_name,thumbnail_url").eq("content_type","event").in("status",["published","featured"]).order("published_at",{ascending:false}).limit(4)
 ]);
 if(!event)notFound();
 const cover=event.image_url||event.seo_og_image_url||fallback;
 const pageUrl=event.seo_canonical_url||`${base}/events/${slug}`;
 const shareDescription=event.seo_og_description||event.seo_description||event.description||`Publish your ${event.name} event video with Sri Gaur Nitai.`;
 return <div className="page">
  <div className="detail-back"><Link href="/events"><ArrowLeft size={18}/> Back to Events</Link></div>
  <section className="contest-detail-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(82,4,37,.88),rgba(82,4,37,.35)),url(${cover})`}}><div className="contest-detail-copy"><span className="gold-badge"><CalendarHeart size={13}/>{event.name}</span><h1>{event.name} Video Publishing</h1><p>{event.description||`Celebrate and publish your ${event.name.toLowerCase()} memories through Sri Gaur Nitai.`}</p><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:17}}><Link href={`/events/submit?category=${event.slug}`} className="btn btn-gold">Create Event Request</Link><Link href="/videos?type=event" className="btn btn-outline"><Play size={15}/>Published Videos</Link></div></div></section>
  <SocialShare title={event.seo_og_title||event.seo_title||`${event.name} Event Video Service`} description={shareDescription} url={pageUrl}/>
  <div className="contest-content-grid">
   <section className="pretty-panel"><h2><Sparkles size={20}/> About This Event Service</h2><p>{event.description||"Submit your celebration video for review, scheduling and publishing."}</p><div className="business-facts"><div className="business-fact"><span>Starting price</span><strong>₹{Number(event.base_price||0).toLocaleString("en-IN")}</strong></div><div className="business-fact"><span>Publishing workflow</span><strong>Review → Schedule → Publish</strong></div></div></section>
   <section className="pretty-panel"><h2><CheckCircle2 size={20}/> Rules & Terms</h2><h3>Rules</h3><p>{event.rules||"Upload clear, respectful and permitted content suitable for public publishing."}</p><h3>Terms</h3><p>{event.terms||"Publishing remains subject to review, package terms and scheduling availability."}</p></section>
  </div>
  <section className="section"><div className="section-head"><div><h2><Gift size={18}/>Publishing Packages</h2><p>Choose the level of publishing support you need.</p></div></div><div className="package-grid">{(packages||[]).map((p:any)=><Link className="package-card" href={`/events/submit?category=${event.slug}&package=${p.id}`} key={p.id}>{p.badge&&<span className="gold-badge">{p.badge}</span>}<h3>{p.name}</h3><b>{Number(p.price_modifier)?`+ ₹${Number(p.price_modifier).toLocaleString("en-IN")}`:"Base Price"}</b><p>{p.description}</p><ul>{(p.features||[]).map((f:string)=><li key={f}>✓ {f}</li>)}</ul><span className="btn btn-primary">Choose Package</span></Link>)}</div></section>
  {videos?.length?<section className="section"><div className="section-head"><div><h2><Play size={18}/>Recent Event Videos</h2><p>Publicly approved event videos from Sri Gaur Nitai.</p></div></div><div className="video-grid">{videos.map((v:any)=><Link className="video-card" href={`/videos/${v.id}`} key={v.id}><div className="video-thumb" style={{backgroundImage:`url(${v.thumbnail_url||cover})`}}><span className="play-orb"><Play size={20}/></span></div><div className="video-copy"><span>Published Event</span><h3>{v.title}</h3><p>{v.participant_name}</p></div></Link>)}</div></section>:null}
  <section className="section pretty-panel" style={{textAlign:"center"}}><h2 style={{justifyContent:"center"}}>Ready to publish your {event.name.toLowerCase()}?</h2><Link className="btn btn-primary" href={`/events/submit?category=${event.slug}`}>Start Event Request</Link></section>
 </div>;
}
