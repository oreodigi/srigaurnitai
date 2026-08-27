import Link from "next/link";
import { ArrowLeft, CalendarDays, Share2, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

function youtubeEmbed(url?: string | null) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: video } = await supabase.from("public_videos").select("*").eq("id",id).in("status",["published","featured"]).maybeSingle();
  if (!video) notFound();
  const embed = youtubeEmbed(video.youtube_url || video.video_url);
  return <div className="page public-video-page">
    <div className="detail-back"><Link href="/videos"><ArrowLeft size={18}/> Public Videos</Link></div>
    <div className="video-player-shell">{video.mux_playback_id ? <video controls playsInline poster={video.thumbnail_url||undefined} src={`https://stream.mux.com/${video.mux_playback_id}.m3u8`} /> : embed ? <iframe src={embed} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : <div className="video-fallback" style={{backgroundImage:`url(${video.thumbnail_url})`}}>Video source will be added after publishing.</div>}</div>
    <section className="video-info-panel"><div className="video-title-row"><div><span className="card-kicker">{video.content_type} video</span><h1>{video.title}</h1></div><button type="button" className="icon-action"><Share2 size={20}/></button></div><p>{video.description}</p><div className="video-info-meta"><span><UserRound size={15}/>{video.participant_name||"Sri Gaur Nitai"}</span><span><CalendarDays size={15}/>{new Date(video.published_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span></div></section>
    <section className="section"><div className="section-head"><div><h2>Explore More</h2><p>Watch more community videos and winner performances.</p></div><Link className="section-link" href="/videos">View all</Link></div></section>
  </div>;
}
