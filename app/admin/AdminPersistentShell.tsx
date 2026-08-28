"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, BriefcaseBusiness, CalendarHeart, ChevronDown, CreditCard, FileText, Headphones, LayoutDashboard, Library, Menu, SearchCheck, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Tags, Trophy, UsersRound, Video, WalletCards, X } from "lucide-react";
import { BrandIcon } from "@/components/BrandLogo";

const groups=[
 {label:"Content & Campaigns",icon:Trophy,items:[
  ["Contests","/admin?open=Contests",Trophy],["Contest Categories","/admin?open=Contest%20Categories",Tags],["Campaigns","/admin?open=Campaigns",Sparkles],["Review Contest Submissions","/admin/reviews/contests",Video],["Events & Requests","/admin?open=Events%20%26%20Requests",CalendarHeart],["Event Categories","/admin?open=Event%20Categories",Tags],["Publishing Packages","/admin?open=Publishing%20Packages",WalletCards],["Review Event Submissions","/admin/reviews/events",CalendarHeart]
 ]},
 {label:"Businesses & Commerce",icon:BriefcaseBusiness,items:[
  ["Businesses","/admin?open=Businesses",BriefcaseBusiness],["Review Business Listings","/admin/reviews/businesses",ShieldCheck],["Business Categories","/admin?open=Business%20Categories",Tags],["Business Plans","/admin?open=Business%20Plans",CreditCard],["Payments","/admin?open=Payments",CreditCard],["Enquiries","/admin/enquiries",FileText]
 ]},
 {label:"Community & Operations",icon:UsersRound,items:[
  ["Site Users","/admin/users",UsersRound],["Staff & Roles","/admin/staff",ShieldCheck],["Support Desk","/admin/support",Headphones]
 ]},
 {label:"Content Tools",icon:Library,items:[
  ["Blog & Daily Quotes","/admin/blog",BookOpen],["CMS & Banners","/admin?open=CMS%20%26%20Banners",FileText],["Media Library","/admin/media",Library],["Pages & Policies","/admin/pages",FileText]
 ]},
 {label:"Settings",icon:Settings,items:[
  ["Settings Home","/admin/settings",Settings],["Website UI & Theme","/admin/ui",SlidersHorizontal],["SEO & Social","/admin/seo",SearchCheck],["Integrations","/admin/integrations",Sparkles],["Advanced Data","/admin/advanced",BarChart3]
 ]}
] as const;

export default function AdminPersistentShell({children}:{children:React.ReactNode}){
 const pathname=usePathname();
 const [drawer,setDrawer]=useState(false);
 const [open,setOpen]=useState<Record<string,boolean>>({"Content & Campaigns":true,"Businesses & Commerce":true,"Community & Operations":true,"Content Tools":true,"Settings":true});
 if(pathname==="/admin") return <>{children}</>;
 return <div className="admin-global-shell">
  {drawer&&<button className="admin-global-backdrop" aria-label="Close navigation" onClick={()=>setDrawer(false)}/>} 
  <aside className={drawer?"admin-global-side open":"admin-global-side"}>
   <div className="admin-global-brand"><BrandIcon size={48}/><div><strong>Sri Gaur Nitai</strong><span>Administration</span></div><button className="admin-global-close" onClick={()=>setDrawer(false)}><X size={18}/></button></div>
   <nav>
    <Link className={pathname==="/admin"?"active":""} href="/admin"><LayoutDashboard size={17}/><span>Dashboard</span></Link>
    {groups.map(g=>{const G=g.icon;const expanded=!!open[g.label];return <section key={g.label} className={expanded?"open":""}>
      <button className="admin-global-group" onClick={()=>setOpen(v=>({...v,[g.label]:!expanded}))}><span><G size={16}/>{g.label}</span><ChevronDown size={14}/></button>
      <div className="admin-global-items">{g.items.map(([label,href,I])=><Link key={href} className={pathname===href.split("?")[0]?"active":""} href={href} onClick={()=>setDrawer(false)}><I size={15}/><span>{label}</span></Link>)}</div>
    </section>})}
   </nav>
  </aside>
  <div className="admin-global-main"><div className="admin-global-mobilebar"><button onClick={()=>setDrawer(true)}><Menu size={20}/></button><strong>Admin</strong><Link href="/admin"><LayoutDashboard size={17}/></Link></div>{children}</div>
 </div>
}
