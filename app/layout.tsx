import type { Metadata, Viewport } from "next";
import { AppChrome } from "@/components/AppChrome";
import { supabase } from "@/lib/supabase";
import "./globals.css";
import "./functional.css";
import "./polish.css";
import "./mobile-fixes.css";
import "./desktop.css";
import "./social-share.css";
import "./support/support.css";
import "./admin/admin.css";
import "./admin/identity-admin.css";
import "./admin/support/support-admin.css";
import "./admin/enquiries/enquiries-admin.css";
import "./admin/admin-ux-overrides.css";
import "./admin/seo/seo-admin.css";

export async function generateMetadata():Promise<Metadata>{
 const {data:s}=await supabase.from("site_seo_settings").select("*").limit(1).maybeSingle();
 const base=s?.canonical_base_url||"https://srigaurnitai.vercel.app";
 const title=s?.default_title||"Sri Gaur Nitai";
 const description=s?.default_description||"Spiritual contests, event video publishing, community videos and trusted businesses.";
 const image=s?.default_og_image_url||undefined;
 return {
  metadataBase:new URL(base),
  applicationName:s?.site_name||"Sri Gaur Nitai",
  title:{default:title,template:s?.title_template||"%s | Sri Gaur Nitai"},
  description,
  keywords:s?.default_keywords||undefined,
  alternates:{canonical:base},
  robots:{index:s?.robots_index!==false,follow:s?.robots_follow!==false},
  verification:s?.google_site_verification?{google:s.google_site_verification}:undefined,
  openGraph:{type:"website",siteName:s?.site_name||"Sri Gaur Nitai",title,description,url:base,images:image?[{url:image}]:undefined},
  twitter:{card:"summary_large_image",title,description,images:image?[image]:undefined,creator:s?.twitter_handle||undefined}
 };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#720b32" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppChrome>{children}</AppChrome></body></html>;
}
