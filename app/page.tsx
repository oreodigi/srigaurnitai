import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, MapPin, Trophy } from "lucide-react";

const youth=[['💃','Classical Dance'],['📖','Spiritual Story'],['🥁','Hari Naam Kirtan'],['🎵','Spiritual Song'],['📜','Sloka Recitation']];
const kids=[['🩰','Classical Dance'],['📚','Spiritual Story'],['🥁','Hari Naam Kirtan'],['🎶','Spiritual Song'],['🪶','Sloka Recitation']];
const memories=[
 {name:'Vedic Birthday Celebration with Kirtan',img:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80'},
 {name:'Vedic Pre-Wedding Video',img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80'},
 {name:'Vedic Wedding Video',img:'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=500&q=80'},
 {name:'Vedic Anniversary Video',img:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80'},
 {name:'Vedic Annaprashan Video',img:'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=500&q=80'}
];
const contests=[
 {title:'Bhakti Voice Challenge',text:'Show your devotion through your voice.',emoji:'🎙️'},
 {title:'Little Stars Talent',text:'A platform for our little devotees.',emoji:'🪈'},
 {title:'Hari Naam Kirtan',text:'Celebrate nama sankirtan with the community.',emoji:'🥁'}
];
const businesses=[
 {name:'Om Camera Studio',type:'Photography & Videography',city:'Vrindavan, UP',img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80'},
 {name:'Nataraj Dance Academy',type:'Classical Dance Training',city:'Mathura, UP',img:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80'},
 {name:'Sur Sadhana Music School',type:'Hindustani Music Classes',city:'Delhi, India',img:'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80'}
];

export default function HomePage(){return <div className="page">
 <section className="hero-banner"><div className="hero-copy"><h1>Serve. Share.<br/><span className="gold">Spread Krishna Consciousness</span></h1><p>Join our spiritual community, share your talent and celebrate meaningful moments together.</p><Link className="hero-cta" href="/contests">Join Our Mission <ArrowRight size={14}/></Link></div><div className="hero-dots"><i/><i/><i/><i/></div></section>

 <section className="section"><div className="section-head"><div><h2>🌼 Free Services</h2></div><span className="section-link">See all</span></div><div className="service-panel"><div className="service-title"><strong>Spiritual Youth Services</strong></div><div className="service-rail">{youth.map(([icon,name])=><div className="service-card" key={name}><div className="art">{icon}</div><strong>{name}</strong></div>)}</div></div></section>

 <section className="section"><div className="section-head"><div><h2>🏅 Spiritual Memories — Starting ₹999</h2></div><Link className="section-link" href="/events">See all</Link></div><div className="service-rail">{memories.map(m=><Link href="/events" className="memory-card" key={m.name}><div className="photo" style={{backgroundImage:`url(${m.img})`}}/><strong>{m.name}</strong></Link>)}</div></section>

 <section className="section"><div className="service-panel kids"><div className="service-title"><strong>🧒 Spiritual Kids Services</strong><span className="section-link">See all</span></div><div className="service-rail">{kids.map(([icon,name])=><div className="service-card" key={name}><div className="art">{icon}</div><strong>{name}</strong></div>)}</div></div></section>

 <section className="section"><div className="section-head"><div><h2><Trophy size={19}/> Current Contests</h2></div><Link className="section-link" href="/contests">View all</Link></div><div className="contest-rail">{contests.map(c=><Link className="mini-contest" href="/contests" key={c.title}><h3>{c.title}</h3><p>{c.text}</p><span className="hero-cta">Participate Now</span><span className="emoji">{c.emoji}</span></Link>)}</div></section>

 <section className="section"><div className="section-head"><div><h2><BriefcaseBusiness size={19}/> Featured Businesses</h2></div><Link className="section-link" href="/businesses">See all</Link></div><div className="business-grid">{businesses.map(b=><Link className="business-card" href="/businesses" key={b.name}><div className="business-thumb" style={{backgroundImage:`url(${b.img})`}}/><div className="business-body"><h3>{b.name}</h3><p>{b.type}</p><span className="location"><MapPin size={10}/>{b.city}</span></div></Link>)}</div></section>

 <section className="section winner-hero"><h1>Selected winners get opportunities for <span className="gold">professional podcast shoots</span>.</h1><p>Selected participants may also be considered for international travel opportunities.</p><Link className="hero-cta" href="/winners">Explore Winners <ArrowRight size={14}/></Link></section>
 </div>}
