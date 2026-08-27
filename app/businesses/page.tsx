import Link from "next/link";
import { Building2, Camera, ChevronRight, Gem, MapPin, Music2, Search, Sparkles, Star, Store, UtensilsCrossed, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = { Photography: Camera, Education: UsersRound, "Event Management": Sparkles, Restaurants: UtensilsCrossed, Hotels: Building2, Jewellery: Gem, Fashion: Store };
const fallbackImages=["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=82","https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=82","https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=82"];

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
  const popular=(categories||[]).filter((c:any)=>["photography","education","event-management","wedding-services","religious-services","travel"].includes(c.slug)).slice(0,6);

  return <div className="page directory-page">
    <div className="page-title-row"><div><h1>Businesses</h1><p>Discover trusted community businesses, teachers, studios and professional services.</p></div><Link className="btn btn-primary" href="/businesses/register">+ List Business</Link></div>
    <form className="directory-search" action="/businesses" method="get"><Search size={19}/><input name="q" defaultValue={params.q||""} placeholder="Search businesses, services or keywords"/><button type="submit">Search</button></form>
    <div className="category-row business-category-row"><Link className={!params.category?"category-chip active":"category-chip"} href="/businesses">All</Link>{(categories||[]).map((c:any)=>{const Icon=iconMap[c.name]||Music2;return <Link key={c.id} className={params.category===c.slug?"category-chip active":"category-chip"} href={`/businesses?category=${c.slug}${params.city?`&city=${encodeURIComponent(params.city)}`:""}`}><Icon size={15}/>{c.name}</Link>})}</div>
    <div className="directory-filters"><form action="/businesses" method="get"><input type="hidden" name="q" value={params.q||""}/><input type="hidden" name="category" value={params.category||""}/><select name="city" defaultValue={params.city||""}><option value="">All Cities</option>{cities.map(c=><option value={c} key={c}>{c}</option>)}</select><button type="submit">Apply</button></form><span>{businesses.length} verified/demo listings</span></div>

    {featured && <section><div className="section-head"><div><h2>👑 Featured Business</h2><p>Promoted community listing</p></div></div><Link className="featured-business-hero" href={`/businesses/${featured.slug}`} style={{backgroundImage:`linear-gradient(90deg,rgba(71,4,32,.97),rgba(71,4,32,.6),rgba(71,4,32,.08)),url(${featured.photos?.[0]||fallbackImages[0]})`}}><div><span className="gold-badge"><Star size={13} fill="currentColor"/> Featured • Verified</span><h2>{featured.name}</h2><p>{featured.description}</p><span className="hero-location"><MapPin size={15}/>{featured.city}, {featured.state}</span><span className="btn gold-btn">View Full Profile <ChevronRight size={16}/></span></div></Link></section>}

    <section className="section"><div className="section-head"><div><h2>Popular Categories</h2><p>Quickly find the right service.</p></div><span className="section-link">Swipe</span></div><div className="category-visual-grid">{popular.map((c:any)=>{const Icon=iconMap[c.name]||Music2;return <Link className="category-visual" href={`/businesses?category=${c.slug}`} key={c.id}><Icon size={22}/><strong>{c.name}</strong></Link>})}</div></section>

    <section className="section"><div className="section-head"><div><h2>All Businesses</h2><p>Open a profile for photos, services, packages, videos, social links, contact and payment information.</p></div></div><div className="business-grid">{businesses.map((b:any,i:number)=><Link className="business-card" href={`/businesses/${b.slug}`} key={b.id}><div className="business-thumb" style={{backgroundImage:`url(${b.photos?.[0]||fallbackImages[i%fallbackImages.length]})`}}>{b.is_featured&&<span>Featured</span>}</div><div className="business-card-copy"><div className="business-rating"><Star size={13} fill="currentColor"/> {(4.6+(i%4)*.1).toFixed(1)} <small>• Verified</small></div><h3>{b.name}</h3><p>{b.business_categories?.name}</p><span className="business-location"><MapPin size={13}/>{b.city}, {b.state}</span><div className="service-mini">{(b.services||[]).slice(0,3).map((s:string)=><em key={s}>{s}</em>)}</div><span className="btn btn-outline" style={{marginTop:10}}>View Details</span></div></Link>)}</div>{!businesses.length&&<div className="empty-state"><Store/><h3>No businesses found</h3><p>Try another category, city or keyword.</p></div>}</section>

    <section className="section pretty-panel"><h2><Sparkles size={20}/> Grow Your Business with Sri Gaur Nitai</h2><p>Create a detailed profile, upload photos, add services, YouTube and social links, receive inquiries and choose featured visibility plans.</p><Link href="/businesses/register" className="btn btn-primary">Register Your Business</Link></section>
  </div>;
}
