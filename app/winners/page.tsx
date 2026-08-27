export const dynamic = "force-dynamic";
import Link from "next/link";
import { Award, Mic2, Plane, Play, Quote, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

const fallbackPeople=[
 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=82",
 "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=82",
 "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=82",
 "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=82"
];
const stories=[
 {name:"Ananya Sharma",text:"Sharing devotional music publicly gave me confidence and connected me with a much larger community."},
 {name:"Kavya Iyer",text:"The contest gave classical dance a meaningful spiritual context and motivated me to prepare a stronger performance."},
 {name:"Rohit Verma",text:"The submission and review workflow makes it easy to participate and keep track of every stage."}
];

export default async function WinnersPage(){
 const [{data:winners},{data:videos}]=await Promise.all([
  supabase.from("winners").select("id,winner_name,profile_picture_url,winning_video_url,position,prize_amount,description,announcement_at,contests(title,slug)").order("announcement_at",{ascending:false}).limit(12),
  supabase.from("public_videos").select("id,title,participant_name,thumbnail_url,content_type").eq("content_type","contest").eq("status","published").order("published_at",{ascending:false}).limit(6)
 ]);
 const rows=(winners||[]) as any[];
 return <div className="page">
  <div className="page-title-row"><div><h1>Winners</h1><p>Recognition, public winning videos and opportunities beyond the contest.</p></div><Link href="/videos?type=contest" className="btn btn-primary"><Play size={14}/> Watch Videos</Link></div>
  <section className="winner-hero"><span className="gold-badge"><Sparkles size={13}/> Winner Opportunities</span><h1>Recognition that can open <span className="gold">new doors.</span></h1><p>Selected winners may be invited for professional podcast shoots, creator spotlights and special campaigns. Selected participants may also be considered for international travel opportunities where applicable.</p><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}><span className="btn btn-gold"><Mic2 size={15}/> Podcast Opportunities</span><span className="btn btn-outline"><Plane size={15}/> Campaign Travel</span></div></section>

  <section className="section"><div className="section-head"><div><h2><Trophy size={19}/> Current Winners</h2><p>Live winner records managed by the Sri Gaur Nitai team.</p></div></div>{rows.length?<div className="winner-grid">{rows.map((w:any,i:number)=>{const contest=Array.isArray(w.contests)?w.contests[0]:w.contests;return <div className="winner-card" key={w.id}><span className="rank">{w.position}</span><div className="winner-photo" style={{backgroundImage:`url(${w.profile_picture_url||fallbackPeople[i%fallbackPeople.length]})`}}/><h3>{w.winner_name}</h3><p>{contest?.title||"Sri Gaur Nitai Contest"}</p>{w.description&&<p style={{padding:"0 8px"}}>{w.description}</p>}<div className="winner-prize">Prize ₹{Number(w.prize_amount||0).toLocaleString("en-IN")}</div></div>})}</div>:<div className="empty-state"><Award/><h3>Winner announcements coming soon</h3><p>Approved winners will automatically appear here.</p></div>}</section>

  <section className="section"><div className="section-head"><div><h2><Play size={18}/> Winning & Featured Videos</h2><p>Public videos can be watched without logging in.</p></div><Link className="section-link" href="/videos?type=contest">View all</Link></div><div className="video-grid">{(videos||[]).map((v:any)=><Link className="video-card" href={`/videos/${v.id}`} key={v.id}><div className="video-thumb" style={{backgroundImage:`url(${v.thumbnail_url||fallbackPeople[0]})`}}><span className="play-orb"><Play size={20} fill="currentColor"/></span></div><div className="video-copy"><span>Community Highlight</span><h3>{v.title}</h3><p>{v.participant_name||"Participant"}</p></div></Link>)}</div></section>

  <section className="section"><div className="section-head"><div><h2><Quote size={18}/> Success Stories</h2><p>Demo community stories for the production experience.</p></div></div><div className="cards">{stories.map(s=><div className="pretty-panel" key={s.name}><Quote size={24} style={{color:"var(--gold2)"}}/><p>{s.text}</p><strong style={{color:"var(--wine2)",fontFamily:"Georgia,serif"}}>{s.name}</strong></div>)}</div></section>

  <section className="section pretty-panel" style={{textAlign:"center",background:"linear-gradient(120deg,#fff3db,#fff)"}}><h2 style={{justifyContent:"center"}}><Award size={20}/> Your talent could be featured next.</h2><p>Join an active contest, submit your video and follow its progress from your account.</p><Link href="/contests" className="btn btn-primary">Explore Contests</Link></section>
 </div>;
}
