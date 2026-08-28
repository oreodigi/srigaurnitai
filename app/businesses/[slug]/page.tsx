import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, Globe2, Instagram, Mail, MapPin, MessageCircle, Phone, Play, ShieldCheck, Star, Youtube } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BusinessInquiryForm } from "@/components/BusinessInquiryForm";
import { SocialShare } from "@/components/SocialShare";

const fallback="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85";
const base="https://srigaurnitai.vercel.app";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const {data:b}=await supabase.from("businesses").select("name,description,photos,logo_url,seo_title,seo_description,seo_keywords,seo_canonical_url,seo_og_title,seo_og_description,seo_og_image_url,seo_noindex").eq("slug",slug).eq("status","approved").maybeSingle();
 if(!b)return {};
 const title=b.seo_title||b.name;
 const description=b.seo_description||b.description||`View ${b.name} on Sri Gaur Nitai.`;
 const canonical=b.seo_canonical_url||`${base}/businesses/${slug}`;
 const image=b.seo_og_image_url||b.logo_url||(b.photos?.[0])||undefined;
 return {title,description,keywords:b.seo_keywords||undefined,alternates:{canonical},robots:{index:!b.seo_noindex,follow:true},openGraph:{type:"website",title:b.seo_og_title||title,description:b.seo_og_description||description,url:canonical,images:image?[{url:image}]:undefined},twitter:{card:"summary_large_image",title:b.seo_og_title||title,description:b.seo_og_description||description,images:image?[image]:undefined}};
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: business } = await supabase.from("businesses").select("*,business_categories(name),business_subcategories(name),business_plans(name,badge,monthly_price,annual_price)").eq("slug", slug).eq("status", "approved").maybeSingle();
  if (!business) notFound();
  const photos=(business.photos?.length?business.photos:[fallback]);
  const photo = photos[0] || fallback;
  const address = [business.address,business.city,business.state,business.pincode].filter(Boolean).join(", ");
  const maps = business.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const whatsapp = business.whatsapp ? `https://wa.me/${String(business.whatsapp).replace(/\D/g,"")}` : null;
  const socials=business.social_links||{};
  const pageUrl=business.seo_canonical_url||`${base}/businesses/${slug}`;
  const shareDescription=business.seo_og_description||business.seo_description||business.description||`${business.name} on Sri Gaur Nitai.`;
  const schema=business.seo_schema&&typeof business.seo_schema==="object"&&Object.keys(business.seo_schema).length?business.seo_schema:null;
  const isWedding=String(business.business_categories?.name||"").toLowerCase().includes("wedding")||business.name.toLowerCase().includes("wedding");
  const packages=isWedding?[
    {name:"Silver Package",price:"₹45,000",features:["1 Cinematographer","1 Photographer","Full-day coverage","3–4 minute highlight film","200+ edited photos"]},
    {name:"Gold Package",price:"₹75,000",featured:true,features:["2 Cinematographers","1 Photographer","Full-day coverage","5–7 minute highlight film","500+ edited photos","Drone shots"]},
    {name:"Platinum Package",price:"₹1,25,000",features:["3 Cinematographers","2 Photographers","Full-day coverage","Teaser + highlight + full film","Unlimited edited photos","Drone + live screening"]}
  ]:[
    {name:"Starter",price:"₹4,999+",features:["Consultation","Core service package","Digital delivery","Standard support"]},
    {name:"Popular",price:"₹9,999+",featured:true,features:["Priority scheduling","Expanded service coverage","Premium deliverables","WhatsApp support"]},
    {name:"Premium",price:"Custom",features:["Custom scope","Dedicated coordinator","Priority delivery","Add-on services"]}
  ];
  return <>{schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>}<div className="page business-detail-page">
    <div className="detail-back"><Link href="/businesses"><ArrowLeft size={18}/> Back to Businesses</Link></div>
    <section className="business-cover" style={{backgroundImage:`linear-gradient(0deg,rgba(31,4,16,.91),rgba(31,4,16,.08)),url(${photo})`}}>
      <div className="business-cover-copy"><div className="gold-badge">{business.is_featured ? "Featured Business" : "Verified Community Business"}</div><h1>{business.name} <ShieldCheck size={20} style={{display:"inline"}}/></h1><p>{business.business_categories?.name} {business.business_subcategories?.name ? `• ${business.business_subcategories.name}` : ""}</p><div className="profile-meta-strip"><span><Star size={14} fill="currentColor"/>4.8 (128 reviews)</span><span>• 8+ years demo experience</span><span><MapPin size={13}/>{business.city}, {business.state}</span></div></div>
    </section>

    <div className="profile-gallery">{photos.slice(0,5).map((p:string,i:number)=><img src={p} alt={`${business.name} photo ${i+1}`} key={p}/>)}</div>

    <div className="detail-actions">
      {business.phone && <a className="detail-action" href={`tel:${business.phone}`}><Phone size={19}/><span>Call</span></a>}
      {whatsapp && <a className="detail-action" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={19}/><span>WhatsApp</span></a>}
      {business.email && <a className="detail-action" href={`mailto:${business.email}`}><Mail size={19}/><span>Email</span></a>}
      <a className="detail-action" href={maps} target="_blank" rel="noreferrer"><MapPin size={19}/><span>Directions</span></a>
    </div>
    <SocialShare title={business.seo_og_title||business.seo_title||business.name} description={shareDescription} url={pageUrl}/>

    <div className="business-section-grid">
      <div>
        <section className="detail-panel"><h2>About Us</h2><p>{business.description || "Business profile on Sri Gaur Nitai."}</p>{business.additional_info && <p>{business.additional_info}</p>}<div className="business-facts"><div className="business-fact"><span>Business Type</span><strong>{business.business_categories?.name}</strong></div><div className="business-fact"><span>Listing Plan</span><strong>{business.business_plans?.name||"Community Listing"}</strong></div><div className="business-fact"><span>Location</span><strong>{business.city||"India"}</strong></div><div className="business-fact"><span>Status</span><strong>Verified / Approved</strong></div></div></section>
        <section className="detail-panel section"><h2>Our Services</h2><div className="service-list">{(business.services || []).map((s:string)=><span key={s}>✓ {s}</span>)}</div></section>
        <section className="detail-panel section"><h2>Packages & Pricing</h2><div className="package-grid">{packages.map(p=><div className={p.featured?"package-card featured":"package-card"} key={p.name}>{p.featured&&<span className="gold-badge">Most Popular</span>}<h3>{p.name}</h3><b>{p.price}</b><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul><a href="#inquiry" className="btn btn-outline">Request Package</a></div>)}</div></section>
        <section className="detail-panel section"><h2>Photo Gallery</h2><div className="gallery-rail">{photos.map((p:string,i:number)=><img src={p} alt={`${business.name} gallery ${i+1}`} key={`${p}-${i}`}/>)}</div></section>
      </div>

      <aside>
        <section className="detail-panel"><h2>Business Information</h2>{address && <div className="info-row"><MapPin size={17}/><div><strong>Address</strong><span>{address}</span></div></div>}{business.phone && <div className="info-row"><Phone size={17}/><div><strong>Phone</strong><a href={`tel:${business.phone}`}>{business.phone}</a></div></div>}{business.email && <div className="info-row"><Mail size={17}/><div><strong>Email</strong><a href={`mailto:${business.email}`}>{business.email}</a></div></div>}{business.website && <div className="info-row"><Globe2 size={17}/><div><strong>Website</strong><a href={business.website} target="_blank" rel="noreferrer">Visit website <ExternalLink size={12}/></a></div></div>}</section>
        <section className="detail-panel section"><h2>Opening Hours</h2><div className="info-row"><Clock size={17}/><div>{Object.entries(business.opening_hours || {"Monday - Saturday":"9:00 AM - 8:00 PM","Sunday":"10:00 AM - 6:00 PM"}).map(([day,hours])=><span key={day}><strong>{day}</strong>: {String(hours)}</span>)}</div></div></section>
        <section className="detail-panel section"><h2>Follow Us</h2><div className="social-row">{socials.instagram&&<a className="social-pill" href={String(socials.instagram)} target="_blank" rel="noreferrer"><Instagram size={15}/>Instagram</a>}{socials.youtube&&<a className="social-pill" href={String(socials.youtube)} target="_blank" rel="noreferrer"><Youtube size={15}/>YouTube</a>}{socials.facebook&&<a className="social-pill" href={String(socials.facebook)} target="_blank" rel="noreferrer">Facebook</a>}{!Object.keys(socials).length&&<span className="form-note">Social handles can be managed from the business account.</span>}</div></section>
        {business.youtube_url&&<section className="detail-panel section"><h2>Featured Video</h2><a className="yt-card" href={business.youtube_url} target="_blank" rel="noreferrer" style={{backgroundImage:`url(${photos[1]||photo})`}}><span><Play size={16} style={{verticalAlign:"middle"}}/> Watch on YouTube</span></a></section>}
        <section className="detail-panel section"><h2>Payment Options</h2><div className="payment-row"><span className="payment-pill">UPI</span><span className="payment-pill">RuPay</span><span className="payment-pill">Visa</span><span className="payment-pill">Mastercard</span><span className="payment-pill">Bank Transfer</span><span className="payment-pill">Cash</span></div><p>Payments are made directly to the business. Sri Gaur Nitai listing does not guarantee third-party services.</p></section>
      </aside>
    </div>

    <section className="detail-panel section" id="inquiry"><h2>Send an Inquiry</h2><p>Share your requirement and the business can follow up directly.</p><BusinessInquiryForm businessId={business.id} businessName={business.name}/></section>
    <section className="section pretty-panel" style={{textAlign:"center",background:"linear-gradient(110deg,#fff6e7,#fff)"}}><h2 style={{justifyContent:"center"}}>Ready to connect with {business.name}?</h2><div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>{whatsapp&&<a className="btn btn-primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={15}/> WhatsApp Now</a>}<a className="btn btn-gold" href="#inquiry">Send Inquiry</a></div></section>
  </div></>;
}
