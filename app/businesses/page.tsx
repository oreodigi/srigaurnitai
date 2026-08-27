import Link from "next/link";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function BusinessesPage() {
  const [{ data: categories }, { data: businesses }, { data: plans }] = await Promise.all([
    supabase.from("business_categories").select("id,name,slug").eq("is_active", true).order("sort_order"),
    supabase.from("businesses").select("id,name,slug,description,city,state,services,is_featured,business_categories(name)").eq("status", "approved").order("is_featured", { ascending: false }).limit(24),
    supabase.from("business_plans").select("id,name,monthly_price,annual_price,badge,features").eq("is_active", true).order("priority"),
  ]);
  return <div className="page">
    <div className="section-head"><div><h2>Business Directory</h2><p>Discover services and register your own business.</p></div><Link className="section-link" href="/businesses/register">Add business</Link></div>
    <div className="category-row">{(categories ?? []).map((c:any)=><span className="category-chip" key={c.id}>{c.name}</span>)}</div>
    <section className="section">
      <div className="section-head"><div><h2>Featured & Approved</h2></div></div>
      {businesses?.length ? <div className="cards">{businesses.map((item:any)=><Link className="card" href={`/businesses/${item.slug}`} key={item.id}><div className="card-body"><span className="card-kicker">{item.business_categories?.name ?? "Business"}</span><h3>{item.name}</h3><p>{item.description || "Business profile on Sri Gaur Nitai."}</p><div className="card-meta"><span className="tag"><MapPin size={11}/> {item.city || "India"}</span>{item.is_featured && <span className="tag">Featured</span>}</div></div></Link>)}</div> : <div className="empty-state"><BriefcaseBusiness/><h3>Be among the first listed businesses</h3><p>Approved listings will appear here after registration and review.</p><div className="hero-actions" style={{justifyContent:"center"}}><Link className="btn btn-primary" href="/businesses/register">Register Business</Link></div></div>}
    </section>
    <section className="section"><div className="section-head"><div><h2>Listing Plans</h2><p>Pricing is managed from the admin dashboard.</p></div></div><div className="cards">{(plans ?? []).map((plan:any)=><div className="card" key={plan.id}><div className="card-body"><span className="card-kicker">{plan.badge || "Listing"}</span><h3>{plan.name}</h3><p>₹{Number(plan.monthly_price).toLocaleString("en-IN")}/month • ₹{Number(plan.annual_price).toLocaleString("en-IN")}/year</p><div className="card-meta">{plan.features?.map((f:string)=><span className="tag" key={f}>{f}</span>)}</div></div></div>)}</div></section>
  </div>;
}
