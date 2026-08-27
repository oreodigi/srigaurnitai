import Link from "next/link";
import { Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function ContestsPage() {
  const { data: contests } = await supabase.from("contests").select("id,title,slug,description,submission_close_at,participation_fee,first_prize,second_prize,third_prize,contest_categories(name)").eq("is_active", true).order("submission_close_at");
  return <div className="page">
    <div className="section-head"><div><h2>Video Contests</h2><p>Choose a contest, review rules and submit your video.</p></div></div>
    <div className="cards">
      {(contests ?? []).map((contest: any) => <Link href={`/contests/${contest.slug}`} className="card" key={contest.id}><div className="card-body"><span className="card-kicker">{contest.contest_categories?.name}</span><h3>{contest.title}</h3><p>{contest.description}</p><div className="card-meta"><span className="tag">Entry ₹{Number(contest.participation_fee).toLocaleString("en-IN")}</span><span className="tag">Video submission</span></div><div className="prize">Prizes: ₹{Number(contest.first_prize).toLocaleString("en-IN")} • ₹{Number(contest.second_prize).toLocaleString("en-IN")} • ₹{Number(contest.third_prize).toLocaleString("en-IN")}</div></div></Link>)}
    </div>
    {!contests?.length && <div className="empty-state"><Trophy/><h3>No active contests</h3><p>New contests will appear here when launched.</p></div>}
  </div>;
}
