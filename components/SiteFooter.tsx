"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BrandIcon } from "@/components/BrandLogo";

export function SiteFooter(){
 const [pages,setPages]=useState<any[]>([]);
 useEffect(()=>{supabase.from("site_pages").select("title,slug,footer_group,sort_order").eq("is_published",true).eq("show_in_footer",true).order("footer_group").order("sort_order").then(({data})=>setPages(data||[]))},[]);
 const groups=useMemo(()=>pages.reduce((a:any,p:any)=>{const k=p.footer_group||"Links";(a[k]||=[]).push(p);return a},{}),[pages]);
 return <footer className="site-footer"><div className="site-footer-brand"><BrandIcon size={64}/><div><strong>Sri Gaur Nitai</strong><span>Spirituality • Creativity • Community</span></div></div><div className="site-footer-groups">{Object.entries(groups).map(([group,items]:any)=><div key={group}><strong>{group}</strong>{items.map((p:any)=><Link key={p.slug} href={`/pages/${p.slug}`}>{p.title}</Link>)}</div>)}<div><strong>Platform</strong><Link href="/contests">Contests</Link><Link href="/events">Events</Link><Link href="/businesses">Businesses</Link><Link href="/videos">Public Videos</Link><Link href="/account">My Account</Link></div><div><strong>Help</strong><Link href="/support">Support Center</Link><Link href="/support?type=contest">Contest Support</Link><Link href="/support?type=event">Event Support</Link><Link href="/support?type=business">Business Support</Link><Link href="/support?type=payment">Payments & Refunds</Link></div></div><div className="site-footer-bottom"><span>© {new Date().getFullYear()} Sri Gaur Nitai</span><span>Community media & services platform</span></div></footer>
}
