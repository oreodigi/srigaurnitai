import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarHeart, Play, Sparkles, Trophy, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getHomeData() {
  const [{ data: contests }, { data: categories }, { data: winners }] = await Promise.all([
    supabase.from("contests").select("id,title,slug,description,submission_close_at,participation_fee,first_prize,is_featured,contest_categories(name)").eq("is_active", true).order("is_featured", { ascending: false }).limit(6),
    supabase.from("business_categories").select("id,name,slug").eq("is_active", true).order("sort_order").limit(10),
    supabase.from("winners").select("id,winner_name,position,prize_amount,description,contests(title)").order("announcement_at", { ascending: false }).limit(3),
  ]);
  return { contests: contests ?? [], categories: categories ?? [], winners: winners ?? [] };
}

function money(value: number | null) {
  if (!value) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default async function HomePage() {
  const { contests, categories, winners } = await getHomeData();

  return (
    <div className="page">
      <section className="hero">
        <span className="eyebrow"><Sparkles size={14} /> Sri Gaur Nitai</span>
        <h1>Celebrate. Create. Get Discovered.</h1>
        <p>Join community contests, publish special occasion videos, discover trusted businesses and follow winner opportunities from one platform.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/contests">Explore Contests <ArrowRight size={16} /></Link>
          <Link className="btn btn-secondary" href="/events">Publish an Event</Link>
        </div>
      </section>

      <section className="quick-grid" aria-label="Quick actions">
        <Link href="/contests" className="quick-card"><Trophy size={22} /><strong>Join a Contest</strong><span>Upload your talent and track every stage.</span></Link>
        <Link href="/events" className="quick-card"><CalendarHeart size={22} /><strong>Publish a Celebration</strong><span>Birthday, wedding, anniversary and more.</span></Link>
        <Link href="/businesses" className="quick-card"><BriefcaseBusiness size={22} /><strong>List Your Business</strong><span>Get discovered through the community directory.</span></Link>
        <Link href="/winners" className="quick-card"><UsersRound size={22} /><strong>Meet the Winners</strong><span>Winning videos, stories and opportunities.</span></Link>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Live & Upcoming Contests</h2><p>Participate directly from your phone.</p></div><Link className="section-link" href="/contests">View all</Link></div>
        <div className="cards">
          {contests.map((contest: any) => (
            <Link className="card" href={`/contests/${contest.slug}`} key={contest.id}>
              <div className="card-body">
                <span className="card-kicker">{contest.contest_categories?.name ?? "Contest"}</span>
                <h3>{contest.title}</h3>
                <p>{contest.description}</p>
                <div className="card-meta"><span className="tag">Entry: {money(Number(contest.participation_fee))}</span><span className="tag">Mobile upload</span></div>
                <div className="prize">First prize: {money(Number(contest.first_prize))}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section winner-banner">
        <span className="card-kicker">Winner Opportunities</span>
        <h2>Beyond the Trophy</h2>
        <p>Selected winners may receive opportunities for professional podcast shoots. Selected participants may also be considered for international travel opportunities through Sri Gaur Nitai campaigns.</p>
        <div className="hero-actions"><Link href="/winners" className="btn btn-primary">See Winners</Link></div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Discover Businesses</h2><p>Browse local services by category.</p></div><Link className="section-link" href="/businesses">Directory</Link></div>
        <div className="category-row">
          {categories.map((category: any) => <Link key={category.id} href={`/businesses?category=${category.slug}`} className="category-chip">{category.name}</Link>)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Recent Winners</h2><p>Community recognition and success stories.</p></div></div>
        {winners.length ? <div className="cards">{winners.map((winner: any) => <div className="card" key={winner.id}><div className="card-body"><span className="card-kicker">Position #{winner.position}</span><h3>{winner.winner_name}</h3><p>{winner.contests?.title}</p><div className="prize">Prize: {money(Number(winner.prize_amount))}</div></div></div>)}</div> : <div className="empty-state"><Play size={24} /><h3>First winners coming soon</h3><p>Winner profiles and videos will appear here after the first contest announcement.</p></div>}
      </section>
    </div>
  );
}
