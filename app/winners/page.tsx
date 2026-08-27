const winners=[
 {rank:1,name:'Aarav Sharma',contest:'Bhakti Voice Challenge',prize:'₹25,000',img:'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?auto=format&fit=crop&w=500&q=80'},
 {rank:2,name:'Saanvi Reddy',contest:'Spiritual Song Contest',prize:'₹15,000',img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80'},
 {rank:3,name:'Ishita Das',contest:'Hari Naam Kirtan Challenge',prize:'₹10,000',img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'},
 {rank:4,name:'Rohan Kulkarni',contest:'Spiritual Story Contest',prize:'₹5,000',img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80'}
];
const stories=[
 ['Aarav Sharma','This platform gave me confidence and a purpose. Today, I’m doing what I love — sharing devotion through music.'],
 ['Saanvi Reddy','From a participant to a speaker, this journey changed my life and introduced me to amazing people.'],
 ['Rohan Kulkarni','I never imagined my passion could open doors to travel and new opportunities.'],
 ['Ishita Das','The support from this community is truly special. It feels like much more than a contest.']
];
export default function WinnersPage(){return <div className="page">
 <div className="page-title"><div><h1>Winners</h1><p>Recognition, stories and opportunities.</p></div></div>
 <section className="winner-hero"><h1>Selected Winners Get an Opportunity for <span className="gold">Professional Podcast Shoots</span></h1><p>Selected participants may get an opportunity to travel to international destinations based on campaign selection.</p></section>
 <section className="section"><div className="section-head"><div><h2>🏆 Current Winners</h2></div><span className="section-link">See all</span></div><div className="winner-grid">{winners.map(w=><div className="winner-card" key={w.name}><span className="rank">{w.rank}</span><div className="winner-photo" style={{backgroundImage:`url(${w.img})`}}/><h3>{w.name}</h3><p>{w.contest}</p><div className="winner-prize">🪙 {w.prize}</div></div>)}</div></section>
 <section className="section"><div className="section-head"><div><h2>👑 Previous Winners</h2></div><span className="section-link">See all</span></div><div className="service-rail">{['2025','2024','2023','2022','2021','2020'].map(y=><div className="service-card" key={y}><div className="art">🏅</div><strong>{y}</strong></div>)}</div></section>
 <section className="section"><div className="section-head"><div><h2>▶ Winning Videos</h2></div><span className="section-link">See all</span></div><div className="contest-rail">{winners.slice(0,3).map((w,i)=><div className="mini-contest" key={w.name}><h3>{w.name}</h3><p>{w.contest}</p><span className="emoji">▶️</span><span className="badge" style={{position:'absolute',bottom:13,left:16}}>{['04:32','05:18','06:44'][i]}</span></div>)}</div></section>
 <section className="section"><div className="section-head"><div><h2>⭐ Success Stories</h2></div></div><div className="cards">{stories.map(([name,text])=><div className="card" key={name}><div className="card-body"><span style={{fontSize:25,color:'#f2a51b'}}>“</span><p>{text}</p><h3 style={{marginTop:10}}>{name}</h3></div></div>)}</div></section>
 </div>}
