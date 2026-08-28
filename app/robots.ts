import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function robots():Promise<MetadataRoute.Robots>{
 const {data:s}=await supabase.from("site_seo_settings").select("canonical_base_url,robots_index,robots_follow").limit(1).maybeSingle();
 const base=s?.canonical_base_url||"https://srigaurnitai.vercel.app";
 return {rules:{userAgent:"*",allow:s?.robots_index===false?undefined:"/",disallow:s?.robots_index===false?"/":undefined},sitemap:`${base}/sitemap.xml`,host:base};
}
