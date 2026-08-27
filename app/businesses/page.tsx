import { MapPin, Phone, Search } from "lucide-react";

const cats=['📷 Camera Studios','💃 Dance Schools','🎵 Music Schools','🌼 Event Decor','📸 Photography','💍 Wedding Services','🛕 Religious Services'];
const businesses=[
 {name:'Om Camera Studio',desc:'Professional photography for all your special moments.',city:'Vrindavan, UP',img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80',featured:true},
 {name:'Nataraj Dance Academy',desc:'Classical dance training in Bharatanatyam & Kathak.',city:'Mathura, UP',img:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=700&q=80',featured:true},
 {name:'Sur Sadhana Music School',desc:'Learn Hindustani Classical, vocal and instrumental music.',city:'Delhi, India',img:'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=80',featured:true},
 {name:'Krishna Wedding Films',desc:'Cinematic wedding films that tell your unique story.',city:'Vrindavan, UP',img:'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80',featured:true},
 {name:'Meera Boutique',desc:'Ethnic wear, sarees and custom tailoring.',city:'Jaipur, Rajasthan',img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80'},
 {name:'Radha Event Decor',desc:'Beautiful decor for weddings, festivals and special events.',city:'Mathura, UP',img:'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=700&q=80'},
 {name:'Govinda Caterers',desc:'Pure vegetarian catering for devotional and family events.',city:'Noida, UP',img:'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=700&q=80'},
 {name:'Vrindavan Tours & Seva',desc:'Pilgrimage tours, temple visits and local spiritual experiences.',city:'Vrindavan, UP',img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80'}
];
export default function BusinessesPage(){return <div className="page">
 <div className="page-title"><div><h1>Businesses</h1><p>Discover trusted Indian community businesses and services.</p></div></div>
 <div className="searchbar"><Search size={18}/><input placeholder="Search businesses, services, or keywords"/><span>☰</span></div>
 <div className="chips" style={{marginTop:12}}>{cats.map((c,i)=><span className={`chip ${i===0?'active':''}`} key={c}>{c}</span>)}</div>
 <section className="section feature-banner"><span className="badge">★ Featured Business</span><h2>Krishna Wedding Films</h2><p>Cinematic wedding storytellers capturing precious moments with devotion and artistry.</p><div className="meta-line" style={{color:'#fff',marginTop:13}}><span><MapPin size={12}/>Vrindavan, UP</span><span>🏆 20+ Years Experience</span></div><span className="hero-cta">View Profile</span></section>
 <div className="filter-row"><div className="filter-pill">All Categories ▾</div><div className="filter-pill">All Cities ▾</div></div>
 <section className="business-grid">{businesses.map(b=><div className="business-card" key={b.name}><div className="business-thumb" style={{backgroundImage:`url(${b.img})`}}/><div className="business-body"><h3>{b.name}</h3>{b.featured&&<span className="badge" style={{marginTop:5}}>★ Featured</span>}<p>{b.desc}</p><span className="location"><MapPin size={10}/>{b.city}</span><div className="business-actions"><a href="#"><Phone size={10}/>Call</a><a href="#">◉ WhatsApp</a></div></div></div>)}</section>
 </div>}
