import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function EventsPage() {
  const [{ data: categories }, { data: packages }] = await Promise.all([
    supabase.from("event_categories").select("id,name,slug,base_price").eq("is_active", true).order("sort_order"),
    supabase.from("event_packages").select("id,name,description,price_modifier,features").eq("is_active", true).order("sort_order"),
  ]);
  return <div className="page">
    <div className="section-head"><div><h2>Publish a Special Event</h2><p>Submit a celebration video for review and publishing through Sri Gaur Nitai.</p></div></div>
    <section className="winner-banner"><span className="card-kicker">Celebrations</span><h2>Your moment deserves a stage.</h2><p>Select an occasion and publishing package. You can track payment, review, scheduling and the final YouTube link from your account.</p></section>
    <section className="section"><div className="section-head"><div><h2>Event Categories</h2></div></div><div className="cards">{(categories ?? []).map((item:any)=><Link className="card" href={`/events/submit?category=${item.slug}`} key={item.id}><div className="card-body"><span className="card-kicker">Starting ₹{Number(item.base_price).toLocaleString("en-IN")}</span><h3>{item.name}</h3><p>Upload video, select requested publication date and submit for approval.</p></div></Link>)}</div></section>
    <section className="section"><div className="section-head"><div><h2>Publishing Packages</h2><p>Admin pricing remains configurable.</p></div></div><div className="cards">{(packages ?? []).map((item:any)=><div className="card" key={item.id}><div className="card-body"><span className="card-kicker">+ ₹{Number(item.price_modifier).toLocaleString("en-IN")}</span><h3>{item.name}</h3><p>{item.description}</p><div className="card-meta">{item.features?.map((feature:string)=><span className="tag" key={feature}>{feature}</span>)}</div></div></div>)}</div></section>
    {!categories?.length && <div className="empty-state"><CalendarHeart/><h3>Event publishing is being configured</h3></div>}
  </div>;
}
