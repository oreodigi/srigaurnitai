"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides=[
 {title:"Serve. Share.",accent:"Spread Krishna Consciousness",copy:"Join our spiritual community, share your talent and celebrate meaningful moments together.",cta:"Join Our Mission",href:"/contests",image:"https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=1400&q=88"},
 {title:"Share Your Devotion",accent:"Win. Inspire. Celebrate.",copy:"Participate in devotional singing, dance, kirtan, stories and creative contests.",cta:"Explore Contests",href:"/contests",image:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=88"},
 {title:"Make Memories Sacred",accent:"Vedic Celebrations from ₹999",copy:"Birthday, wedding, anniversary and family memories with devotional publishing support.",cta:"Explore Services",href:"/events",image:"https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=88"}
];
export function HomeHero(){const [active,setActive]=useState(0);useEffect(()=>{const t=setInterval(()=>setActive(v=>(v+1)%slides.length),5500);return()=>clearInterval(t)},[]);const s=slides[active];return <section className="home-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(78,4,35,.96) 0%,rgba(116,5,51,.88) 48%,rgba(74,8,30,.28) 100%),url(${s.image})`}}><div className="home-hero-copy"><span className="home-hero-kicker">Sri Gaur Nitai Community</span><h1>{s.title}<br/><em>{s.accent}</em></h1><p>{s.copy}</p><Link className="hero-cta" href={s.href}>{s.cta}<ArrowRight size={16}/></Link></div><div className="home-hero-dots" aria-label="Banner navigation">{slides.map((_,i)=><button key={i} aria-label={`Banner ${i+1}`} className={i===active?"active":""} onClick={()=>setActive(i)}/>)}</div></section>}
