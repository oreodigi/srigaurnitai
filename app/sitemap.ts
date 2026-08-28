import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const [{data:s},{data:contests},{data:events},{data:businesses},{data:pages},{data:posts},{data:blogCategories}]=await Promise.all([
  supabase.from("site_seo_settings").select("canonical_base_url").limit(1).maybeSingle(),
  supabase.from("contests").select("slug,updated_at,seo_noindex").eq("is_active",true),
  supabase.from("event_categories").select("slug,seo_noindex").eq("is_active",true),
  supabase.from("businesses").select("slug,updated_at,seo_noindex").eq("status","approved"),
  supabase.from("site_pages").select("slug,updated_at,is_published").eq("is_published",true),
  supabase.from("blog_posts").select("slug,updated_at,published_at,seo_noindex").eq("status","published"),
  supabase.from("blog_categories").select("slug,updated_at").eq("is_active",true)
 ]);
 const base=s?.canonical_base_url||"https://app.srigaurnitai.com";
 const fixed=["","/contests","/events","/businesses","/videos","/winners","/blog"].map(path=>({url:`${base}${path}`,changeFrequency:path==="/blog"?"daily" as const:"weekly" as const,priority:path?0.8:1}));
 return [
  ...fixed,
  ...(contests||[]).filter((x:any)=>!x.seo_noindex).map((x:any)=>({url:`${base}/contests/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:"weekly" as const,priority:0.8})),
  ...(events||[]).filter((x:any)=>!x.seo_noindex).map((x:any)=>({url:`${base}/events/${x.slug}`,changeFrequency:"monthly" as const,priority:0.7})),
  ...(businesses||[]).filter((x:any)=>!x.seo_noindex).map((x:any)=>({url:`${base}/businesses/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:"weekly" as const,priority:0.7})),
  ...(posts||[]).filter((x:any)=>!x.seo_noindex).map((x:any)=>({url:`${base}/blog/${x.slug}`,lastModified:new Date(x.updated_at||x.published_at),changeFrequency:"monthly" as const,priority:0.72})),
  ...(blogCategories||[]).map((x:any)=>({url:`${base}/blog/category/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:x.slug==="daily-quotes"?"daily" as const:"weekly" as const,priority:0.65})),
  ...(pages||[]).map((x:any)=>({url:`${base}/pages/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:"monthly" as const,priority:0.5}))
 ];
}
