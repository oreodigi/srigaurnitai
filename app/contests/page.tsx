import Link from "next/link";
import { CalendarDays, ChevronRight, IndianRupee, Play, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

const images:Record<string,string>={
 Singing:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=82",
 Dancing:"https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=82",
 "Kids Content":"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=82",
 "Short Films":"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=82",
 "Educational Content":"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=82",
 "Cultural Performances":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=82"
};

export default async function ContestsPage({searchParams}:{searchParams:Promise<{category?:string;view?:string}>}){
 const {category,view}=await searchParams;
 const [{data:rows},{data:recent},{data:cats}]=await Promise.all([
  supabase.from("contests").select("id,title,slug,description,submission_close_at,participation_fee,first_prize,second_prize,third_prize,is_featured,contest_categories(name,slug)").eq("is_active",true).order("is_featured",{ascending:false}).order("submission_close_at"),
  supabase.from("public_videos").select("id,title,participant_name,thumbnail_url,contest_id,published_at").eq("content_type","contest").eq("status","published").order("published_at",{ascending:false}).limit(6),
  supabase.from("contest_categories").select("id,name,slug").eq("is_active",true).order("sort_order")
 ]);
 const contests=(rows||[]).filter((c:any)=>!category||c.contest_categories?.slug===category);
 const featured=contests.find((c:any)=>c.is_featured)||contests[0];
 return <div className="page">
  <div className="page-title-row"><div><h1>Contests</h1><p>Show your devotion, talent and creativity. Track every stage from submission to winner.</p></div><Link className="btn btn-primary" href="/videos?type=contest"><Play size={14}/> Public Videos</Link></div>
  <div className="segmented"><Link className={!view?"active":""} href="/contests">Ongoing</Link><Link className={view==="upcoming"?"active":""} href="/contests?view=upcoming">Upcoming</Link><Link href="/account#contests">My Submissions</Link></div>
  <div className="category-row business-category-row" style={{marginBottom:12}}><Link className={!category?"category-chip active":"category-chip"} href="/contests">All</Link>{(cats||[]).map((c:any)=><Link key={c.id} className={category===c.slug?"category-chip active":"category-chip"} href={`/contests?category=${c.slug}`}>{c.name}</Link>)}</div>
  {featured&&<Link className="featured-business-hero" href={`/contests/${featured.slug}`} style={{backgroundImage:`linear-gradient(90deg,rgba(71,4,32,.97),rgba(71,4,32,.58),rgba(71,4,32,.08)),url(${images[featured.contest_categories?.name]||images.Singing})`}}><div><span className="gold-badge"><Sparkles size={13}/> Featured Contest</span><h2>{featured.title}</h2><p>{featured.description}</p><div className="profile-meta-strip"><span><CalendarDays size={13}/>Closes {featured.submission_close_at?new Date(featured.submission_close_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"Open"}</span><span><IndianRupee size={13}/>{Number(featured.participation_fee)?`₹${Number(featured.participation_fee).toLocaleString("en-IN")}`:"Free entry"}</span><span><Trophy size={13}/>₹{Number(featured.first_prize||0).toLocaleString("en-IN")} first prize</span></div><span className="btn gold-btn">View & Participate <ChevronRight size={15}/></span></div></Link>}
  <section className="section"><div className="section-head"><div><h2>All Active Contests</h2><p>Open any card to see rules, prizes and recent public entries.</p></div></div><div className="business-grid">{contests.map((c:any,i:number)=>{const closes=c.submission_close_at?new Date(c.submission_close_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"Open";const img=images[c.contest_categories?.name]||images.Singing;return <Link className="business-card" href={`/contests/${c.slug}`} key={c.id}><div className="business-thumb" style={{backgroundImage:`url(${img})`}}>{c.is_featured&&<span>Featured</span>}</div><div className="business-card-copy"><div className="business-rating"><Trophy size={13}/> ₹{Number(c.first_prize||0).toLocaleString("en-IN")}</div><h3>{c.title}</h3><p>{c.contest_categories?.name}</p><span className="business-location"><CalendarDays size={13}/>{closes}</span><div className="service-mini"><em>{Number(c.participation_fee)?`Entry ₹${Number(c.participation_fee).toLocaleString("en-IN")}`:"Free Entry"}</em><em>Video Contest</em></div><span className="btn btn-outline" style={{marginTop:10}}>View Contest</span></div></Link>})}</div></section>
  <section className="section"><div className="section-head"><div><h2>Recent Community Entries</h2><p>Approved videos are visible publicly.</p></div><Link className="section-link" href="/videos?type=contest">View all</Link></div><div className="video-grid">{(recent||[]).map((v:any)=><Link href={`/videos/${v.id}`} className="video-card" key={v.id}><div className="video-thumb" style={{backgroundImage:`url(${v.thumbnail_url||images.Singing})`}}><span className="play-orb"><Play size={19} fill="currentColor"/></span></div><div className="video-copy"><span>Public Entry</span><h3>{v.title}</h3><p>by {v.participant_name||"Participant"}</p></div></Link>)}</div></section>
 </div>;
}
