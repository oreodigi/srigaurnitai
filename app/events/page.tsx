import Link from "next/link";
import { Crown, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

const emoji:Record<string,string>={Birthday:'🎂',Wedding:'💍','Wedding Anniversary':'🌹',Engagement:'🤝','Baby Shower':'🎈','Naming Ceremony':'🪔',Graduation:'🎓','Business Opening':'✂️','Special Wishes':'🎁'};

export default async function EventsPage(){
 const [{data:categories},{data:packages},{data:videos}]=await Promise.all([
  supabase.from("event_categories").select("id,name,slug,base_price").eq("is_active",true).order("sort_order"),
  supabase.from("event_packages").select("id,name,description,price_modifier,features").eq("is_active",true).order("sort_order"),
  supabase.from("public_videos").select("id,title,participant_name,thumbnail_url,published_at").eq("content_type","event").in("status",["published","featured"]).order("published_at",{ascending:false}).limit(6)
 ]);
 return <div className="page">
  <div className="page-title"><div><h1>Events</h1><p>Make every special occasion divine.</p></div></div>
  <section className="hero-banner"><div className="hero-copy"><h2><span className="gold">Make every special occasion divine.</span></h2><p>Publish your celebration videos through Sri Gaur Nitai and inspire thousands.</p><Link className="hero-cta" href="/events/submit">Publish Your Video</Link></div></section>
  <section className="section"><div className="section-head"><div><h2>🌼 Event Categories</h2></div></div><div className="service-rail">{(categories||[]).map((c:any)=><Link className="service-card" href={`/events/submit?category=${c.slug}`} key={c.id}><div className="art">{emoji[c.name]||'🌼'}</div><strong>{c.name}</strong><small>₹{Number(c.base_price).toLocaleString("en-IN")}</small></Link>)}</div></section>
  <section className="section"><div className="section-head"><div><h2><Crown size={18}/> Our Publishing Packages</h2><p>Select a package during submission.</p></div></div><div className="cards">{(packages||[]).map((p:any,i:number)=><Link className="card" href={`/events/submit?package=${p.id}`} key={p.id} style={i===1?{borderColor:'#e8b43d'}:undefined}><div className="card-body">{i===1?<span className="badge">Most Popular</span>:<span className="card-kicker">{p.name}</span>}<h3>{p.name}</h3><p>{p.description}</p><div className="card-meta">{(p.features||[]).slice(0,3).map((f:string)=><span className="tag" key={f}>{f}</span>)}</div><div className="prize">{Number(p.price_modifier)?`Package add-on ₹${Number(p.price_modifier).toLocaleString("en-IN")}`:'Included / base pricing'}</div></div></Link>)}</div></section>
  <section className="section"><div className="section-head"><div><h2><Play size={18}/> Published Event Videos</h2><p>Publicly visible celebrations approved by Sri Gaur Nitai.</p></div><Link className="section-link" href="/videos?type=event">See all</Link></div>{videos?.length?<div className="video-grid">{videos.map((v:any)=><Link className="video-card" href={`/videos/${v.id}`} key={v.id}><div className="video-thumb" style={{backgroundImage:`url(${v.thumbnail_url})`}}><span className="play-orb"><Play size={20} fill="currentColor"/></span></div><div className="video-copy"><span>event</span><h3>{v.title}</h3><p>{v.participant_name}</p></div></Link>)}</div>:<div className="empty-mini">Published event videos will appear here.</div>}</section>
  <section className="section"><div className="account-menu-grid"><Link href="/account#events"><span>📋</span><span><strong>My Event Requests</strong><small>Track review, scheduling and YouTube publishing status.</small></span><span>›</span></Link><Link href="/events/submit"><span>➕</span><span><strong>New Publishing Request</strong><small>Submit another birthday, wedding or celebration video.</small></span><span>›</span></Link></div></section>
 </div>;
}
