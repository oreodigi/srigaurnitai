import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, Globe2, Mail, MapPin, MessageCircle, Phone, Share2, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: business } = await supabase.from("businesses").select("*,business_categories(name),business_subcategories(name),business_plans(name,badge)").eq("slug", slug).eq("status", "approved").maybeSingle();
  if (!business) notFound();
  const photo = business.photos?.[0] || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80";
  const address = [business.address,business.city,business.state,business.pincode].filter(Boolean).join(", ");
  const maps = business.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const whatsapp = business.whatsapp ? `https://wa.me/${String(business.whatsapp).replace(/\D/g,"")}` : null;
  return <div className="page business-detail-page">
    <div className="detail-back"><Link href="/businesses"><ArrowLeft size={18}/> Businesses</Link></div>
    <section className="business-cover" style={{backgroundImage:`linear-gradient(0deg,rgba(31,4,16,.88),rgba(31,4,16,.06)),url(${photo})`}}>
      <div className="business-cover-copy"><div className="gold-badge">{business.is_featured ? "Featured Business" : business.business_categories?.name || "Business"}</div><h1>{business.name}</h1><p>{business.business_categories?.name} {business.business_subcategories?.name ? `• ${business.business_subcategories.name}` : ""}</p><div className="business-rating"><Star size={15} fill="currentColor"/> 4.8 <span>• Community listing</span></div></div>
    </section>
    <div className="detail-actions">
      {business.phone && <a className="detail-action" href={`tel:${business.phone}`}><Phone size={19}/><span>Call</span></a>}
      {whatsapp && <a className="detail-action" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={19}/><span>WhatsApp</span></a>}
      <a className="detail-action" href={maps} target="_blank" rel="noreferrer"><MapPin size={19}/><span>Directions</span></a>
      <button className="detail-action" type="button"><Share2 size={19}/><span>Share</span></button>
    </div>
    <div className="detail-grid">
      <section className="detail-panel"><h2>About</h2><p>{business.description || "Business profile on Sri Gaur Nitai."}</p>{business.additional_info && <p>{business.additional_info}</p>}<h3>Services</h3><div className="service-list">{(business.services || []).map((s:string)=><span key={s}>✓ {s}</span>)}</div></section>
      <aside className="detail-panel"><h2>Business Information</h2>{address && <div className="info-row"><MapPin size={17}/><div><strong>Address</strong><span>{address}</span></div></div>}{business.phone && <div className="info-row"><Phone size={17}/><div><strong>Phone</strong><a href={`tel:${business.phone}`}>{business.phone}</a></div></div>}{business.email && <div className="info-row"><Mail size={17}/><div><strong>Email</strong><a href={`mailto:${business.email}`}>{business.email}</a></div></div>}{business.website && <div className="info-row"><Globe2 size={17}/><div><strong>Website</strong><a href={business.website} target="_blank" rel="noreferrer">Visit website <ExternalLink size={12}/></a></div></div>}<div className="info-row"><Clock size={17}/><div><strong>Opening Hours</strong>{Object.entries(business.opening_hours || {}).map(([day,hours])=><span key={day}>{day}: {String(hours)}</span>)}</div></div></aside>
    </div>
    {business.youtube_url && <section className="detail-panel section"><h2>Business Video</h2><a className="btn btn-primary" href={business.youtube_url} target="_blank" rel="noreferrer">Watch on YouTube <ExternalLink size={15}/></a></section>}
  </div>;
}
