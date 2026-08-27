import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Trophy, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function ContestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: contest } = await supabase.from("contests").select("*,contest_categories(name)").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!contest) notFound();
  const closes = contest.submission_close_at ? new Date(contest.submission_close_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "Open";
  return <div className="page"><section className="hero"><span className="eyebrow"><Trophy size={14}/>{contest.contest_categories?.name}</span><h1>{contest.title}</h1><p>{contest.description}</p><div className="hero-actions"><Link href={`/contests/${slug}/submit`} className="btn btn-primary"><UploadCloud size={16}/> Submit Video</Link></div></section><section className="quick-grid"><div className="quick-card"><Clock3/><strong>Closes {closes}</strong><span>Submit before the deadline.</span></div><div className="quick-card"><strong>Entry Fee</strong><span>{Number(contest.participation_fee) ? `₹${Number(contest.participation_fee).toLocaleString("en-IN")}` : "Free participation"}</span></div><div className="quick-card"><strong>First Prize</strong><span>₹{Number(contest.first_prize).toLocaleString("en-IN")}</span></div><div className="quick-card"><strong>Video Limit</strong><span>{contest.max_duration_seconds ? `${contest.max_duration_seconds} seconds` : "As per contest rules"}</span></div></section><section className="section form-card"><h2>Rules & Eligibility</h2><p>{contest.rules || "Contest-specific rules will be displayed here."}</p><h3>Eligibility</h3><p>{contest.eligibility || "Open to eligible registered users."}</p><h3>Terms</h3><p>{contest.terms || "By participating, users agree to Sri Gaur Nitai contest terms and content review requirements."}</p></section></div>;
}
