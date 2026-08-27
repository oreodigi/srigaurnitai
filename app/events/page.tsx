import Link from "next/link";
import { Crown } from "lucide-react";

const categories=[['🎂','Birthday'],['💍','Wedding'],['🌹','Wedding Anniversary'],['🤝','Engagement'],['🎈','Baby Shower'],['🪔','Naming Ceremony'],['🎓','Graduation'],['✂️','Business Opening'],['🎁','Special Wishes']];
const requests=[
 {name:'Aarav Sharma',type:'Vedic Birthday Celebration',date:'12 Aug 2026',status:'Published',cls:'published',img:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80'},
 {name:'Rohan & Ananya',type:'Vedic Wedding Ceremony',date:'20 Aug 2026',status:'Scheduled',cls:'scheduled',img:'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=500&q=80'},
 {name:'Vikram & Meera',type:'Wedding Anniversary',date:'25 Aug 2026',status:'Under Review',cls:'review',img:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80'},
 {name:'Ishaan Malhotra',type:'Annaprashan Ceremony',date:'02 Sep 2026',status:'Published',cls:'published',img:'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=500&q=80'}
];
export default function EventsPage(){return <div className="page">
 <div className="page-title"><div><h1>Events</h1><p>Make every special occasion divine.</p></div></div>
 <section className="hero-banner"><div className="hero-copy"><h2><span className="gold">Make every special occasion divine.</span></h2><p>Publish your celebration videos through Sri Gaur Nitai and inspire thousands.</p><Link className="hero-cta" href="/events/submit">Publish Your Video</Link></div></section>
 <section className="section"><div className="section-head"><div><h2>🌼 Event Categories</h2></div></div><div className="service-rail">{categories.map(([icon,name])=><Link className="service-card" href="/events/submit" key={name}><div className="art">{icon}</div><strong>{name}</strong></Link>)}</div></section>
 <section className="section"><div className="section-head"><div><h2><Crown size={18}/> Our Publishing Packages</h2></div></div><div className="cards"><div className="card"><div className="card-body"><span className="card-kicker">Standard</span><h3>Standard Publishing</h3><p>Video published through the Sri Gaur Nitai platform workflow.</p><div className="prize">₹999</div></div></div><div className="card" style={{borderColor:'#e8b43d'}}><div className="card-body"><span className="badge">Most Popular</span><h3>Featured Publishing</h3><p>Highlighted placement for greater visibility and priority review.</p><div className="prize">₹1,999</div></div></div><div className="card"><div className="card-body"><span className="card-kicker">Premium</span><h3>Premium Promotion</h3><p>Maximum reach with priority feature and promotional placement.</p><div className="prize">₹4,999</div></div></div></div></section>
 <section className="section"><div className="section-head"><div><h2>🕘 Recent Event Requests</h2></div><span className="section-link">See all</span></div><div className="request-list">{requests.map(r=><div className="request-row" key={r.name}><div className="request-thumb" style={{backgroundImage:`url(${r.img})`}}/><div><h3>{r.name}</h3><p>{r.type}</p><p>{r.date}</p></div><span className={`status ${r.cls}`}>{r.status}</span></div>)}</div></section>
 </div>}
