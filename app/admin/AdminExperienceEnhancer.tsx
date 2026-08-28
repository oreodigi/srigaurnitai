"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BarChart3, BriefcaseBusiness, CalendarHeart, ChevronDown, CreditCard, FileText, Headphones, Image, LayoutDashboard, Library, Megaphone, SearchCheck, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Tags, Trophy, UsersRound, Video, WalletCards } from "lucide-react";

const groups = [
  {label:"Content & Campaigns", icon:Megaphone, items:[
    ["Contests","Contests",Trophy],["Contest Categories","Contest Categories",Tags],["Contest Submissions","Contest Submissions",Video],["Campaigns","Campaigns",Megaphone],["Events & Requests","Events & Requests",CalendarHeart],["Event Categories","Event Categories",Tags],["Publishing Packages","Publishing Packages",WalletCards],
  ]},
  {label:"Businesses & Commerce", icon:BriefcaseBusiness, items:[
    ["Businesses","Businesses",BriefcaseBusiness],["Business Categories","Business Categories",Tags],["Business Plans","Business Plans",CreditCard],["Payments","Payments",CreditCard],
  ]},
  {label:"Community & Operations", icon:UsersRound, links:[
    ["Site Users","/admin/users",UsersRound],["Staff & Roles","/admin/staff",ShieldCheck],["Support Desk","/admin/support",Headphones],["Enquiries","/admin/enquiries",FileText],
  ]},
  {label:"Content Tools", icon:Library, items:[["CMS & Banners","CMS & Banners",Image]], links:[
    ["Media Library","/admin/media",Library],["Pages","/admin/pages",FileText],
  ]},
  {label:"Settings", icon:Settings, links:[
    ["Settings Home","/admin/settings",Settings],["Website UI & Theme","/admin/ui-settings",SlidersHorizontal],["SEO & Social","/admin/seo",SearchCheck],["Integrations","/admin/integrations",Sparkles],["Advanced Data","/admin/advanced",BarChart3],
  ]},
] as const;

function triggerLegacy(label:string){
  const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>(".ma-side nav > button"));
  buttons.find(b=>b.textContent?.trim()===label)?.click();
}

export default function AdminExperienceEnhancer(){
  const [navTarget,setNavTarget]=useState<HTMLElement|null>(null);
  const [contentTarget,setContentTarget]=useState<HTMLElement|null>(null);
  const [open,setOpen]=useState<Record<string,boolean>>({"Content & Campaigns":true,"Businesses & Commerce":true,"Community & Operations":true,"Settings":true});
  const [isOverview,setIsOverview]=useState(false);

  useEffect(()=>{
    const sync=()=>{
      setNavTarget(document.querySelector<HTMLElement>(".ma-side nav"));
      setContentTarget(document.querySelector<HTMLElement>(".ma-content"));
      setIsOverview((document.querySelector(".ma-main > header h1")?.textContent||"").trim()==="Overview");
    };
    sync();
    const ob=new MutationObserver(sync); ob.observe(document.body,{subtree:true,childList:true,characterData:true});
    return()=>ob.disconnect();
  },[]);

  const nav=navTarget?createPortal(<div className="admin-accordion-nav">
    <button className="admin-dashboard-link" onClick={()=>triggerLegacy("Overview")}><LayoutDashboard size={18}/><span>Dashboard</span></button>
    {groups.map(g=>{const Icon=g.icon;const expanded=!!open[g.label];return <section key={g.label} className={expanded?"open":""}>
      <button className="admin-accordion-head" onClick={()=>setOpen(v=>({...v,[g.label]:!expanded}))}><span><Icon size={17}/>{g.label}</span><ChevronDown size={15}/></button>
      <div className="admin-accordion-body">
        {"items" in g&&g.items?.map(([label,legacy,ItemIcon])=><button key={label} onClick={()=>triggerLegacy(legacy)}><ItemIcon size={16}/><span>{label}</span></button>)}
        {"links" in g&&g.links?.map(([label,href,ItemIcon])=><Link href={href} key={href}><ItemIcon size={16}/><span>{label}</span></Link>)}
      </div>
    </section>})}
  </div>,navTarget):null;

  const dashboard=contentTarget&&isOverview?createPortal(<div className="admin-dashboard-v2">
    <section className="admin-welcome-card"><div><small>CONTROL CENTER</small><h2>Platform Overview</h2><p>Manage content, community operations, commerce, support and site configuration from one place.</p></div><Link href="/admin/settings"><Settings size={17}/>Open Settings</Link></section>
    <div className="admin-module-grid">
      <button onClick={()=>triggerLegacy("Contests")}><Trophy/><strong>Contests</strong><span>Campaigns, rules, entries & SEO</span></button>
      <button onClick={()=>triggerLegacy("Events & Requests")}><CalendarHeart/><strong>Events</strong><span>Requests, categories & publishing</span></button>
      <button onClick={()=>triggerLegacy("Businesses")}><BriefcaseBusiness/><strong>Businesses</strong><span>Listings, plans & approvals</span></button>
      <Link href="/admin/support"><Headphones/><strong>Support Desk</strong><span>Tickets, SLA, replies & assignment</span></Link>
      <Link href="/admin/users"><UsersRound/><strong>Site Users</strong><span>Customer profiles & activity</span></Link>
      <Link href="/admin/staff"><ShieldCheck/><strong>Staff & Roles</strong><span>Admins, moderators & teams</span></Link>
      <Link href="/admin/media"><Library/><strong>Media Library</strong><span>Reusable images and video assets</span></Link>
      <Link href="/admin/ui-settings"><SlidersHorizontal/><strong>Website UI</strong><span>Branding, colors, header & mobile</span></Link>
      <Link href="/admin/seo"><SearchCheck/><strong>SEO & Social</strong><span>Global and per-content optimization</span></Link>
      <Link href="/admin/integrations"><Sparkles/><strong>Integrations</strong><span>Razorpay, Maps, Mux and APIs</span></Link>
      <Link href="/admin/pages"><FileText/><strong>Pages</strong><span>Legal pages and custom content</span></Link>
      <Link href="/admin/settings"><Settings/><strong>All Settings</strong><span>Central configuration hub</span></Link>
    </div>
  </div>,contentTarget):null;

  return <>{nav}{dashboard}</>;
}
