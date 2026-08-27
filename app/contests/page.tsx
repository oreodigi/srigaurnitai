import Link from "next/link";
import { CalendarDays, IndianRupee, Trophy } from "lucide-react";

const contests=[
 {title:'Bhakti Voice Challenge',sub:'Spiritual Song Contest',deadline:'25 Sep 2026',fee:'₹99',prize:'₹11,000',emoji:'🎙️'},
 {title:'Hari Naam Kirtan Contest',sub:'Kirtan & Nama Sankirtan',deadline:'01 Oct 2026',fee:'₹51',prize:'₹15,000',emoji:'🥁'},
 {title:'Classical Dance Mahotsav',sub:'Classical Dance Contest',deadline:'10 Oct 2026',fee:'₹149',prize:'₹21,000',emoji:'💃'},
 {title:'Little Stars Talent',sub:'Kids Talent Showcase',deadline:'20 Oct 2026',fee:'₹49',prize:'₹5,100',emoji:'🪈'}
];
const submissions=[
 {name:'Ananya Sharma',contest:'Bhakti Voice Challenge',code:'SGN-C-1021',date:'18 Aug 2026',status:'Approved',cls:'approved'},
 {name:'Rohit Verma',contest:'Hari Naam Kirtan Contest',code:'SGN-C-1022',date:'17 Aug 2026',status:'Under Review',cls:'review'},
 {name:'Kavya Iyer',contest:'Classical Dance Mahotsav',code:'SGN-C-1023',date:'16 Aug 2026',status:'Shortlisted',cls:'shortlisted'}
];
export default function ContestsPage(){return <div className="page">
 <div className="page-title"><div><h1>Contests</h1><p>Show your devotion. Inspire the community.</p></div></div>
 <div className="segmented"><span className="active">Ongoing</span><span>Upcoming</span><span>My Submissions</span></div>
 <section className="hero-banner"><div className="hero-copy"><h2>🏆 <span className="gold">Show Your Devotion.</span><br/>Inspire the World.</h2><p>Participate in spiritual contests and celebrate your talents with the community.</p><span className="hero-cta">How to Participate</span></div></section>
 <section className="section">{contests.map(c=><div className="contest-card" key={c.title}><div className="contest-art">{c.emoji}</div><div className="contest-info"><h3>{c.title}</h3><p>{c.sub}</p><div className="meta-line"><span><CalendarDays size={12}/>Deadline: {c.deadline}</span><span><IndianRupee size={12}/>Entry Fee: {c.fee}</span></div><div className="prize-row"><strong><Trophy size={12}/> Prize {c.prize} • E-Certificate</strong><Link className="btn btn-primary" href="/account">Participate Now</Link></div></div></div>)}</section>
 <section className="section"><div className="section-head"><div><h2>📋 My Submissions</h2></div><span className="section-link">View all</span></div><div className="request-list">{submissions.map(s=><div className="request-row" key={s.code}><div className="request-thumb" style={{background:'linear-gradient(145deg,#f6d8be,#fff1df)',display:'grid',placeItems:'center',fontSize:28}}>👤</div><div><h3>{s.name}</h3><p>{s.contest} • {s.code}</p><p>Submitted {s.date}</p></div><span className={`status ${s.cls}`}>{s.status}</span></div>)}</div></section>
 </div>}
