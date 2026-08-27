import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, CheckCircle2, CircleHelp, Clock3, Gift, Play, Trophy, UploadCloud, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

const art:Record<string,string>={
  "Singing":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1500&q=85",
  "Dancing":"https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1500&q=85",
  "Kids Content":"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1500&q=85",
  "Short Films":"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1500&q=85",
  "Educational Content":"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1500&q=85",
};

export default async function ContestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: contest } = await supabase.from("contests").select("*,contest_categories(name)").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!contest) notFound();
  const {data:videos}=await supabase.from("public_videos").select("id,title,participant_name,thumbnail_url,status").eq("contest_id",contest.id).eq("status","published").order("published_at",{ascending:false}).limit(4);
  const closes = contest.submission_close_at ? new Date(contest.submission_close_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "Open";
  const category=contest.contest_categories?.name||"Contest";
  const cover=art[category]||"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1500&q=85";
  const p1=Number(contest.first_prize||0),p2=Number(contest.second_prize||0),p3=Number(contest.third_prize||0);
  return <div className="page">
    <section className="contest-detail-hero" style={{backgroundImage:`url(${cover})`}}><div className="contest-detail-copy"><span className="gold-badge"><Trophy size={13}/>{category}</span><h1>{contest.title}</h1><p>{contest.description}</p><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:17}}><Link href={`/contests/${slug}/submit`} className="btn btn-gold"><UploadCloud size={16}/> Submit Video</Link><Link href={`/videos?type=contest`} className="btn btn-outline"><Play size={15}/> Watch Entries</Link></div></div></section>

    <section className="detail-stat-grid">
      <div className="detail-stat"><span className="detail-stat-icon"><CalendarDays size={18}/></span><div><span>Closes On</span><strong>{closes}</strong></div></div>
      <div className="detail-stat"><span className="detail-stat-icon"><Gift size={18}/></span><div><span>Entry Fee</span><strong>{Number(contest.participation_fee)?`₹${Number(contest.participation_fee).toLocaleString("en-IN")}`:"Free"}</strong></div></div>
      <div className="detail-stat"><span className="detail-stat-icon"><Trophy size={18}/></span><div><span>First Prize</span><strong>₹{p1.toLocaleString("en-IN")}</strong></div></div>
      <div className="detail-stat"><span className="detail-stat-icon"><Clock3 size={18}/></span><div><span>Video Limit</span><strong>{contest.max_duration_seconds?`${contest.max_duration_seconds} Sec`:"See rules"}</strong></div></div>
    </section>

    <nav className="detail-tabs"><a href="#overview">Overview</a><a href="#rules">Rules</a><a href="#prizes">Prizes</a><a href="#submissions">Submissions</a></nav>

    <div className="contest-content-grid" id="overview">
      <section className="pretty-panel"><h2><BookOpen size={20}/> About the Challenge</h2><p>{contest.description}</p><div className="business-fact" style={{marginTop:12}}><span>Eligibility</span><strong>{contest.eligibility||"Open to registered users"}</strong></div><h3>How to Participate</h3><div className="participate-steps"><div className="participate-step"><p>Record a clear devotional or cultural video within the duration limit.</p></div><div className="participate-step"><p>Open the submission form, add your title and description, then upload or provide your video.</p></div><div className="participate-step"><p>Accept the contest terms and complete payment only when an entry fee applies.</p></div><div className="participate-step"><p>Track Submitted, Under Review, Shortlisted, Finalist and Winner status from My Account.</p></div></div></section>
      <section className="pretty-panel" id="prizes"><h2><Gift size={20}/> Prize Breakdown</h2><div className="prize-list"><div className="prize-line"><span className="prize-medal">1</span><strong>First Prize</strong><b>₹{p1.toLocaleString("en-IN")}</b></div>{p2>0&&<div className="prize-line"><span className="prize-medal" style={{background:"#e8e8e8"}}>2</span><strong>Second Prize</strong><b>₹{p2.toLocaleString("en-IN")}</b></div>}{p3>0&&<div className="prize-line"><span className="prize-medal" style={{background:"#e9a66a"}}>3</span><strong>Third Prize</strong><b>₹{p3.toLocaleString("en-IN")}</b></div>}</div><p style={{marginTop:12}}>Selected winners may also be considered for Sri Gaur Nitai podcast, creator spotlight and special campaign opportunities.</p></section>
      <section className="pretty-panel" id="rules"><h2><CheckCircle2 size={20}/> Rules & Eligibility</h2><h3>Rules</h3><p>{contest.rules||"Original or permitted content only. Respectful, family-friendly entries are required."}</p><h3>Eligibility</h3><p>{contest.eligibility||"Open to eligible registered Sri Gaur Nitai users."}</p><h3>Terms</h3><p>{contest.terms||"By participating, users agree to Sri Gaur Nitai contest terms, content review requirements and winner verification."}</p></section>
      <section className="pretty-panel" id="submissions"><h2><UsersRound size={20}/> Recent Public Submissions</h2>{videos?.length?<div className="submission-showcase">{videos.map((v:any)=><Link className="submission-tile" href={`/videos/${v.id}`} key={v.id}><img src={v.thumbnail_url||cover} alt=""/><div><h3>{v.title}</h3><p>by {v.participant_name||"Sri Gaur Nitai participant"}</p></div><Play size={18}/></Link>)}</div>:<div className="empty-mini">Approved public submissions will appear here. Be among the first to participate.</div>}<Link href="/videos?type=contest" className="btn btn-outline" style={{marginTop:12}}>View All Public Videos</Link></section>
    </div>
    <section className="section pretty-panel" style={{background:"linear-gradient(110deg,#780636,#a31b50)",color:"white"}}><h2 style={{color:"#fff"}}><CircleHelp size={20}/> Need Help?</h2><p style={{color:"#f8e7e9"}}>Questions about eligibility, uploads or payments? Use Support from your account and our team can assist with the entry.</p><Link href="/account#support" className="btn btn-gold">Open Support</Link></section>
  </div>;
}
