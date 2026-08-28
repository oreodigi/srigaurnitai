import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft,Clock,Quote,Share2} from "lucide-react";
import {notFound} from "next/navigation";
import {supabase} from "@/lib/supabase";
import {SocialShare} from "@/components/SocialShare";

const base="https://app.srigaurnitai.com";
export const revalidate=300;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const {data:p}=await supabase.from("blog_posts").select("title,excerpt,featured_image_url,seo_title,seo_description,seo_keywords,seo_canonical_url,seo_og_title,seo_og_description,seo_og_image_url,seo_noindex,status,published_at").eq("slug",slug).maybeSingle();
 if(!p||p.status!=="published")return {};
 const title=p.seo_title||p.title,description=p.seo_description||p.excerpt||"Sri Gaur Nitai Journal",canonical=p.seo_canonical_url||`${base}/blog/${slug}`,image=p.seo_og_image_url||(p.featured_image_url?.startsWith("http")?p.featured_image_url:`${base}${p.featured_image_url}`);
 return {title,description,keywords:p.seo_keywords||undefined,alternates:{canonical},robots:{index:!p.seo_noindex,follow:true},openGraph:{type:"article",title:p.seo_og_title||title,description:p.seo_og_description||description,url:canonical,images:image?[{url:image}]:undefined,publishedTime:p.published_at||undefined},twitter:{card:"summary_large_image",title:p.seo_og_title||title,description:p.seo_og_description||description,images:image?[image]:undefined}};
}

function renderContent(content:string){return content.split(/\n+/).map((line,i)=>{const t=line.trim();if(!t)return null;if(t.startsWith("## "))return <h2 key={i}>{t.slice(3)}</h2>;if(t.startsWith("- "))return <ul key={i}><li>{t.slice(2)}</li></ul>;return <p key={i}>{t}</p>})}

export default async function BlogPostPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const {data:p}=await supabase.from("blog_posts").select("*,blog_categories(name,slug)").eq("slug",slug).eq("status","published").maybeSingle();if(!p)notFound();
 const {data:related}=await supabase.from("blog_posts").select("id,title,slug,excerpt,featured_image_url,image_alt,reading_minutes,blog_categories(name,slug)").eq("status","published").eq("post_type","article").eq("category_id",p.category_id).neq("id",p.id).order("published_at",{ascending:false}).limit(3);
 const url=p.seo_canonical_url||`${base}/blog/${slug}`;
 if(p.post_type==="quote")return <main className="journal-page quotes-page"><Link className="article-back" href="/blog/category/daily-quotes"><ArrowLeft size={15}/>Daily Quotes</Link><section className="journal-hero"><span className="journal-kicker"><Quote size={14}/> DAILY REFLECTION</span><h1>{p.title}</h1><p style={{fontFamily:'Georgia,serif',fontSize:24,maxWidth:820}}>“{p.content}”</p><div className="journal-hero-actions"><Link href="/blog"><ArrowLeft size={15}/>Journal</Link></div></section><div style={{maxWidth:760,margin:'28px auto'}}><SocialShare title={p.title} description={p.excerpt||p.content} url={url}/></div></main>;
 return <main className="article-page"><Link className="article-back" href="/blog"><ArrowLeft size={15}/>Back to Journal</Link><div className="article-hero"><img src={p.featured_image_url} alt={p.image_alt||p.title}/></div><header className="article-head"><span className="category">{p.blog_categories?.name}</span><h1>{p.title}</h1><p>{p.excerpt}</p><div className="article-head-meta"><span><Clock size={12}/> {p.reading_minutes} min read</span><span>{new Date(p.published_at||p.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span><span><Share2 size={12}/> Shareable devotional reading</span></div></header><article className="article-body">{renderContent(p.content)}</article><div className="article-tags">{(p.tags||[]).map((t:string)=><span key={t}>#{t}</span>)}</div><div style={{maxWidth:760,margin:'28px auto'}}><SocialShare title={p.seo_og_title||p.seo_title||p.title} description={p.seo_og_description||p.seo_description||p.excerpt||""} url={url}/></div>{(related||[]).length>0&&<section className="related-posts"><h2>Continue reading</h2><div className="journal-grid">{(related||[]).map((r:any)=><Link className="journal-card" href={`/blog/${r.slug}`} key={r.id}><img src={r.featured_image_url} alt={r.image_alt||r.title}/><div className="journal-card-copy"><span>{r.blog_categories?.name}</span><h3>{r.title}</h3><p>{r.excerpt}</p><div className="journal-meta"><Clock size={12}/>{r.reading_minutes} min read</div></div></Link>)}</div></section>}</main>
}
