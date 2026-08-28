import Link from "next/link";
import {ArrowLeft,BookOpen,Clock,Quote} from "lucide-react";
import {notFound} from "next/navigation";
import {supabase} from "@/lib/supabase";

export const revalidate=300;
export default async function BlogCategoryPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const {data:category}=await supabase.from("blog_categories").select("*").eq("slug",slug).eq("is_active",true).maybeSingle();if(!category)notFound();
 const {data:posts}=await supabase.from("blog_posts").select("id,title,slug,excerpt,featured_image_url,image_alt,reading_minutes,published_at,quote_source,post_type").eq("category_id",category.id).eq("status","published").order("published_at",{ascending:false});
 const quotes=slug==="daily-quotes";
 return <main className={`journal-page ${quotes?"quotes-page":""}`}><Link className="article-back" href="/blog"><ArrowLeft size={15}/>Back to Journal</Link><section className="journal-hero"><span className="journal-kicker">{quotes?<Quote size={14}/>:<BookOpen size={14}/>} {quotes?"DAILY REMEMBRANCE":"JOURNAL CATEGORY"}</span><h1>{category.name}</h1><p>{category.description}</p></section><nav className="journal-categories"><Link href="/blog">All Articles</Link><Link className="active" href={`/blog/category/${slug}`}>{category.name}</Link></nav>{quotes?<div className="quotes-grid">{(posts||[]).map((p:any)=><Link href={`/blog/${p.slug}`} className="quote-card" key={p.id}><Quote size={26}/><blockquote>“{p.excerpt||p.title}”</blockquote><small>{p.quote_source||"Sri Gaur Nitai Reflection"} • {new Date(p.published_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</small></Link>)}</div>:<section className="journal-section"><div className="journal-grid">{(posts||[]).map((p:any)=><Link className="journal-card" href={`/blog/${p.slug}`} key={p.id}><img src={p.featured_image_url} alt={p.image_alt||p.title}/><div className="journal-card-copy"><span>{category.name}</span><h3>{p.title}</h3><p>{p.excerpt}</p><div className="journal-meta"><Clock size={12}/>{p.reading_minutes} min read</div></div></Link>)}</div></section>}{!(posts||[]).length&&<div className="blog-empty"><BookOpen/><h3>No published posts yet</h3></div>}</main>
}
