import Link from "next/link";
import { Baby, CakeSlice, Crown, Gift, Heart, Play, Sparkles, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

const eventVisuals:Record<string,{icon:any,img:string}>={
 Birthday:{icon:CakeSlice,img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=82"},
 Wedding:{icon:Heart,img:"https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=82"},
 "Wedding Anniversary":{icon:Gift,img:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82"},
 Engagement:{icon:Heart,img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=82"},
 "Baby Shower":{icon:Baby,img:"https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=82"},
 "Naming Ceremony":{icon:Sparkles,img:"https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=900&q=82"}
};

export default async function EventsPage(){
 const [{data:categories},{data:packages},{data:videos}]=await Promise.all([
  supabase.from("event_categories").select("id,name,slug,base_price,description,image_url").eq("is_active",true).order("sort_order"),
  supabase.from("event_packages").select("id,name,description,price_modifier,features").eq("is_active",true).order("sort_order"),
  supabase.from("public_videos").select("id,title,participant_name,thumbnail_url,published_at").eq("content_type","event").in("status",["published","featured"]).order("published_at",{ascending:false}).limit(6)
 ]);
 return <div className="page">
  <div className="page-title-row"><div><h1>Events</h1><p>Publish birthdays, weddings and meaningful family moments through Sri Gaur Nitai.</p></div><Link className="btn btn-primary" href="/events/submit">+ New Request</Link></div>
  <section className="featured-business-hero" style={{backgroundImage:"linear-gradient(90deg,rgba(82,4,37,.96),rgba(82,4,37,.58),rgba(82,4,37,.08)),url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=85)"}}><div><span className="gold-badge"><Sparkles size={13}/> Vedic Event Video Services</span><h2>Make Your Special Moments Divine</h2><p>Submit your celebration video, choose a publishing package, request a preferred date and track it through review, scheduling and publishing.</p><Link className="btn gold-btn" href="/events/submit">Publish Your Video</Link></div></section>

  <section className="section"><div className="section-head"><div><h2>Event Categories</h2><p>Open an occasion to see details, packages, rules and sharing options.</p></div></div><div className="business-grid">{(categories||[]).map((c:any)=>{const v=eventVisuals[c.name];const Icon=v?.icon||Sparkles;const img=c.image_url||v?.img||"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=82";return <Link className="business-card" href={`/events/${c.slug}`} key={c.id}><div className="business-thumb" style={{backgroundImage:`url(${img})`}}><span>₹{Number(c.base_price).toLocaleString("en-IN")}</span></div><div className="business-card-copy"><div className="business-rating"><Icon size={13}/> Event Service</div><h3>{c.name}</h3><p>{c.description||"Video review, publishing-date request and status tracking."}</p><span className="btn btn-outline" style={{marginTop:10}}>View Event Service</span></div></Link>})}</div></section>

  <section className="section"><div className="section-head"><div><h2><Crown size={18}/> Publishing Packages</h2><p>Pricing remains fully manageable from Admin.</p></div></div><div className="package-grid">{(packages||[]).map((p:any,i:number)=><Link className={i===1?"package-card featured":"package-card"} href={`/events/submit?package=${p.id}`} key={p.id}>{i===1&&<span className="gold-badge">Most Popular</span>}<h3>{p.name}</h3><b>{Number(p.price_modifier)?`+ ₹${Number(p.price_modifier).toLocaleString("en-IN")}`:"Base Price"}</b><p>{p.description}</p><ul>{(p.features||[]).map((f:string)=><li key={f}>✓ {f}</li>)}</ul><span className="btn btn-primary">Choose Package</span></Link>)}</div></section>

  <section className="section"><div className="section-head"><div><h2><Play size={18}/> Published Event Videos</h2><p>Approved celebrations are public for visitors to watch.</p></div><Link className="section-link" href="/videos?type=event">See all</Link></div>{videos?.length?<div className="video-grid">{videos.map((v:any)=><Link className="video-card" href={`/videos/${v.id}`} key={v.id}><div className="video-thumb" style={{backgroundImage:`url(${v.thumbnail_url})`}}><span className="play-orb"><Play size={20} fill="currentColor"/></span></div><div className="video-copy"><span>Published Event</span><h3>{v.title}</h3><p>{v.participant_name}</p></div></Link>)}</div>:<div className="empty-mini">Published event videos will appear here.</div>}</section>

  <section className="section pretty-panel"><h2><UsersRound size={20}/> Manage Your Requests</h2><p>Signed-in users can see payment status, requested publishing dates, approval/rejection, scheduled status and final YouTube links from My Account.</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Link className="btn btn-primary" href="/account#events">My Event Requests</Link><Link className="btn btn-gold" href="/events/submit">Create New Request</Link></div></section>
 </div>;
}
