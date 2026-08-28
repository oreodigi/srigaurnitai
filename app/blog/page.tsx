import Link from "next/link";
import {BookOpen,Clock,Quote,Search,Sparkles} from "lucide-react";
import {supabase} from "@/lib/supabase";

export const revalidate=300;

export default async function BlogPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const {q}=await searchParams;
 const [{data:categories},{data:postRows},{data:quoteRows}]=await Promise.all([
  supabase.from("blog_categories").select("id,name,slug,description").eq("is_active",true).order("sort_order"),
  supabase.from("blog_posts").select("id,title,slug,excerpt,featured_image_url,image_alt,tags,is_featured,published_at,reading_minutes,blog_categories(name,slug)").eq("status","published").eq("post_type","article").order("published_at",{ascending:false}),
  supabase.from("blog_posts").select("id,title,slug,excerpt,quote_source,published_at").eq("status","published").eq("post_type","quote").order("published_at",{ascending:false}).limit(3)
 ]);
 let posts=(postRows||[]) as any[];
 if(q){const needle=q.toLowerCase();posts=posts.filter(p=>`${p.title} ${p.excerpt||""} ${(p.tags||[]).join(" ")}`.toLowerCase().includes(needle))}
 const featured=posts.find(p=>p.is_featured)||posts[0];
 const side=posts.filter(p=>p.id!==featured?.id).slice(0,3);
 const rest=posts.filter(p=>p.id!==featured?.id&&!side.some(s=>s.id===p.id));
 return <main className="journal-page">
  <section className="journal-hero"><span className="journal-kicker"><Sparkles size={14}/> SRI GAUR NITAI JOURNAL</span><h1>Bhakti for everyday life.</h1><p>Thoughtful articles on Krishna consciousness, ISKCON and Vaishnava culture, spiritual practice, devotional living and community — written to be read slowly and applied practically.</p><div className="journal-hero-actions"><Link href="/blog/category/daily-quotes"><Quote size={15}/>Daily Quotes</Link><Link className="secondary" href="/blog/category/spiritual-practice"><BookOpen size={15}/>Start Reading</Link></div></section>
  <form className="journal-search" action="/blog"><Search size={18}/><input name="q" defaultValue={q||""} placeholder="Search Krishna, japa, Gita, seva, community…"/><button>Search</button></form>
  <nav className="journal-categories"><Link className="active" href="/blog">All Articles</Link>{(categories||[]).map((c:any)=><Link key={c.id} href={`/blog/category/${c.slug}`}>{c.name}</Link>)}</nav>
  {featured&&<section className="journal-section"><div className="journal-section-head"><div><h2>Featured reading</h2><p>Selected reflections from the Sri Gaur Nitai community.</p></div></div><div className="journal-feature-grid"><Link className="journal-feature" href={`/blog/${featured.slug}`}><img src={featured.featured_image_url} alt={featured.image_alt||featured.title}/><div className="journal-feature-copy"><span>{featured.blog_categories?.name}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="journal-meta"><Clock size={12}/>{featured.reading_minutes} min read • {new Date(featured.published_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div></div></Link><div className="journal-side-stack">{side.map((p:any)=><Link className="journal-mini" href={`/blog/${p.slug}`} key={p.id}><img src={p.featured_image_url} alt={p.image_alt||p.title}/><div><span className="journal-kicker" style={{fontSize:8,color:'#a66924'}}>{p.blog_categories?.name}</span><strong>{p.title}</strong><small>{p.reading_minutes} min read</small></div></Link>)}</div></div></section>}
  {rest.length>0&&<section className="journal-section"><div className="journal-section-head"><div><h2>Latest articles</h2><p>Fresh devotional reading for study, reflection and practice.</p></div></div><div className="journal-grid">{rest.map((p:any)=><Link className="journal-card" href={`/blog/${p.slug}`} key={p.id}><img src={p.featured_image_url} alt={p.image_alt||p.title}/><div className="journal-card-copy"><span>{p.blog_categories?.name}</span><h3>{p.title}</h3><p>{p.excerpt}</p><div className="journal-meta"><Clock size={12}/>{p.reading_minutes} min read</div></div></Link>)}</div></section>}
  {(quoteRows||[]).length>0&&<section className="journal-section"><div className="journal-section-head"><div><h2>Daily Quotes</h2><p>Short reflections for remembrance throughout the day.</p></div><Link href="/blog/category/daily-quotes">View all</Link></div><div className="quote-strip">{(quoteRows||[]).map((p:any)=><Link href={`/blog/${p.slug}`} className="quote-card" key={p.id}><Quote size={24}/><blockquote>“{p.excerpt}”</blockquote><small>{p.quote_source||"Sri Gaur Nitai Reflection"}</small></Link>)}</div></section>}
  {!posts.length&&<div className="blog-empty"><BookOpen size={30}/><h3>No articles found</h3><p>Try another search term.</p></div>}
 </main>
}
