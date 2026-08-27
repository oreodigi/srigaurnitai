import Link from "next/link";
import { Play, Sparkles, Trophy, CalendarHeart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  let query = supabase.from("public_videos").select("id,content_type,title,description,participant_name,thumbnail_url,youtube_url,mux_playback_id,is_featured,published_at").in("status",["published","featured"]).order("is_featured",{ascending:false}).order("published_at",{ascending:false});
  if (type && ["contest","event","winner","featured"].includes(type)) query=query.eq("content_type",type);
  const { data: videos } = await query;
  return <div className="page videos-page">
    <section className="video-hero"><span className="eyebrow"><Sparkles size={14}/> Sri Gaur Nitai Community</span><h1>Watch. Celebrate. Be Inspired.</h1><p>Approved contest performances, published celebrations, winner videos and featured community content are publicly available here.</p></section>
    <div className="video-tabs"><Link className={!type?"active":""} href="/videos">All</Link><Link className={type==="contest"?"active":""} href="/videos?type=contest"><Trophy size={15}/> Contests</Link><Link className={type==="event"?"active":""} href="/videos?type=event"><CalendarHeart size={15}/> Events</Link><Link className={type==="winner"?"active":""} href="/videos?type=winner">Winners</Link></div>
    <div className="video-grid">{(videos||[]).map((v:any)=><Link className="video-card" href={`/videos/${v.id}`} key={v.id}><div className="video-thumb" style={{backgroundImage:`url(${v.thumbnail_url||"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80"})`}}><span className="play-orb"><Play size={22} fill="currentColor"/></span>{v.is_featured&&<em>Featured</em>}</div><div className="video-copy"><span>{v.content_type}</span><h3>{v.title}</h3><p>{v.participant_name || "Sri Gaur Nitai Community"}</p></div></Link>)}</div>
    {!videos?.length&&<div className="empty-state"><Play/><h3>No public videos yet</h3><p>Approved and published videos will appear here automatically.</p></div>}
  </div>;
}
