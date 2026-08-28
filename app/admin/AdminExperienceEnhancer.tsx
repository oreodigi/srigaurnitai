"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BarChart3, BookOpen, BriefcaseBusiness, CalendarHeart, ChevronDown, CreditCard, FileText, Headphones, LayoutDashboard, Library, Megaphone, SearchCheck, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Tags, Trophy, UsersRound, Video, WalletCards } from "lucide-react";

const groups = [
  {label:"Content & Campaigns", icon:Megaphone, items:[
    ["Contests","Contests",Trophy],["Contest Categories","Contest Categories",Tags],["Campaigns","Campaigns",Megaphone],["Events & Requests","Events & Requests",CalendarHeart],["Event Categories","Event Categories",Tags],["Publishing Packages","Publishing Packages",WalletCards],
  ], links:[
    ["Review Contest Submissions","/admin/reviews/contests",Video],["Review Event Submissions","/admin/reviews/events",CalendarHeart],
  ]},
  {label:"Businesses & Commerce", icon:BriefcaseBusiness, items:[
    ["Businesses","Businesses",BriefcaseBusiness],["Business Categories","Business Categories",Tags],["Business Plans","Business Plans",CreditCard],["Payments","Payments",CreditCard],
  ], links:[
    ["Review Business Listings","/admin/reviews/businesses",ShieldCheck],
  ]},
  {label:"Community & Operations", icon:UsersRound, links:[
    ["Site Users","/admin/users",UsersRound],["Staff & Roles","/admin/staff",ShieldCheck],["Support Desk","/admin/support",Headphones],["Enquiries","/admin/enquiries",FileText],
  ]},
  {label:"Content Tools", icon:Library, items:[["CMS & Banners","CMS & Banners",Library]], links:[
    ["Blog & Daily Quotes","/admin/blog",BookOpen],["Media Library","/admin/media",Library],["Pages","/admin/pages",FileText],
  ]},
  {label:"Settings", icon:Settings, links:[
    ["Settings Home","/admin/settings",Settings],["Website UI & Theme","/admin/ui",SlidersHorizontal],["SEO & Social","/admin/seo",SearchCheck],["Integrations","/admin/integrations",Sparkles],["Advanced Data","/admin/advanced",BarChart3],
  ]},
] as const;

function triggerLegacy(label:string){
  const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>(".ma-side nav > button"));
  buttons.find(b=>b.textContent?.trim()===label)?.click();
}

export default function AdminExperienceEnhancer(){
  const [navTarget,setNavTarget]=useState<HTMLElement|null>(null);
  const [open,setOpen]=useState<Record<string,boolean>>({"Content & Campaigns":true,"Businesses & Commerce":true,"Community & Operations":true,"Content Tools":true,"Settings":true});

  useEffect(()=>{
    let opened=false;
    const sync=()=>{
      const target=document.querySelector<HTMLElement>(".ma-side nav");
      setNavTarget(target);
      if(target&&!opened){
        const requested=new URLSearchParams(window.location.search).get("open");
        if(requested){opened=true;setTimeout(()=>triggerLegacy(requested),80)}
      }
    };
    sync();
    const ob=new MutationObserver(sync); ob.observe(document.body,{subtree:true,childList:true});
    return()=>ob.disconnect();
  },[]);

  if(!navTarget)return null;
  return createPortal(<div className="admin-accordion-nav">
    <button className="admin-dashboard-link" onClick={()=>triggerLegacy("Overview")}><LayoutDashboard size={18}/><span>Dashboard</span></button>
    {groups.map(g=>{const Icon=g.icon;const expanded=!!open[g.label];return <section key={g.label} className={expanded?"open":""}>
      <button className="admin-accordion-head" onClick={()=>setOpen(v=>({...v,[g.label]:!expanded}))}><span><Icon size={17}/>{g.label}</span><ChevronDown size={15}/></button>
      <div className="admin-accordion-body">
        {"items" in g&&g.items?.map(([label,legacy,ItemIcon])=><button key={label} onClick={()=>triggerLegacy(legacy)}><ItemIcon size={16}/><span>{label}</span></button>)}
        {"links" in g&&g.links?.map(([label,href,ItemIcon])=><Link href={href} key={href}><ItemIcon size={16}/><span>{label}</span></Link>)}
      </div>
    </section>})}
  </div>,navTarget);
}
