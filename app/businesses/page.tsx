import Link from "next/link";
import { Camera, ChevronRight, MapPin, Music2, Search, Star, Store, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = { Photography: Camera, Education: UsersRound, "Event Management": Store };

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; city?: string }> }) {
  const params = await searchParams;
  const [{ data: categories }, { data: cityRows }] = await Promise.all([
    supabase.from("business_categories").select("id,name,slug").eq("is_active",true).order("sort_order"),
    supabase.from("businesses").select("city").eq("status","approved").not("city","is",null)
  ]);
  let query = supabase.from("businesses").select("id,name,slug,description,city,state,services,is_featured,photos,phone,whatsapp,business_categories(name,slug)").eq("status","approved").order("is_featured",{ascending:false}).order("name");
  if (params.q) query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  if (params.city) query = query.eq("city",params.city);
  const { data: rows } = await query;
  const businesses = (rows || []).filter((b:any)=>!params.category || b.business_categories?.slug===params.category);
  const cities = Array.from(new Set((cityRows||[]).map((r:any)=>r.city).filter(Boolean))).sort();
  const featured = businesses.find((b:any)=>b.is_featured) || businesses[0];

  return <div className="page directory-page">
    <div className="page-title-row"><div><h1>Businesses</h1><p>Discover trusted community businesses and professional services.</p></div><Link className="btn btn-primary" href="/businesses/register">List Business</Link></div>
    <form className="directory-search" action="/businesses" method="get"><Search size={19}/><input name="q" defaultValue={params.q||""} placeholder="Search businesses, services or keywords"/><button type="submit">Search</button></form>
    <div className="category-row business-category-row"><Link className={!params.category?"category-chip active":"category-chip"} href="/businesses">All</Link>{(categories||[]).map((c:any)=>{const Icon=iconMap[c.name]||Music2;return <Link key={c.id} className={params.category===c.slug?"category-chip active":"category-chip"} href={`/businesses?category=${c.slug}${params.city?`&city=${encodeURIComponent(params.city)}`:""}`}><Icon size={15}/>{c.name}</Link>})}</div>
    <div className="directory-filters"><form action="/businesses" method="get"><input type="hidden" name="q" value={params.q||""}/><input type="hidden" name="category" value={params.category||""}/><select name="city" defaultValue={params.city||""}><option value="">All Cities</option>{cities.map(c=><option value={c} key={c}>{c}</option>)}</select><button type="submit">Apply</button></form><span>{businesses.length} businesses</span></div>
    {featured && <Link className="featured-business-hero" href={`/businesses/${featured.slug}`} style={{backgroundImage:`linear-gradient(90deg,rgba(71,4,32,.96),rgba(71,4,32,.55),rgba(71,4,32,.08)),url(${featured.photos?.[0]||"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"})`}}><div><span className="gold-badge"><Star size={13} fill="currentColor"/> Featured Business</span><h2>{featured.name}</h2><p>{featured.description}</p><span className="hero-location"><MapPin size={15}/>{featured.city}, {featured.state}</span><span className="btn gold-btn">View Profile <ChevronRight size={16}/></span></div></Link>}
    <section className="section"><div className="section-head"><div><h2>All Businesses</h2><p>Tap a listing to view complete business details.</p></div></div><div className="business-grid">{businesses.map((b:any)=><Link className="business-card" href={`/businesses/${b.slug}`} key={b.id}><div className="business-thumb" style={{backgroundImage:`url(${b.photos?.[0]||"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"})`}}>{b.is_featured&&<span>Featured</span>}</div><div className="business-card-copy"><h3>{b.name}</h3><p>{b.business_categories?.name}</p><div className="business-rating"><Star size={13} fill="currentColor"/> 4.8</div><span className="business-location"><MapPin size={13}/>{b.city}, {b.state}</span><div className="service-mini">{(b.services||[]).slice(0,2).map((s:string)=><em key={s}>{s}</em>)}</div></div></Link>)}</div>{!businesses.length&&<div className="empty-state"><Store/><h3>No businesses found</h3><p>Try another category, city or keyword.</p></div>}</section>
  </div>;
}
