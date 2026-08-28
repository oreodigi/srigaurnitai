"use client";
import Link from "next/link";
import { Award, Bell, BookOpen, BriefcaseBusiness, CalendarHeart, CircleHelp, CircleUserRound, Home, LifeBuoy, Menu, PlayCircle, Quote, Trophy, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import {useSiteUI} from "@/components/SiteUI";

const iconFor=(href:string)=>href==="/contests"?Trophy:href==="/events"?CalendarHeart:href==="/businesses"?BriefcaseBusiness:href==="/blog"?BookOpen:href.includes("daily-quotes")?Quote:href==="/winners"?Award:href==="/videos"?PlayCircle:href.startsWith("/support")?LifeBuoy:href==="/account"?CircleUserRound:Home;
const primary=[{href:"/",label:"Home"},{href:"/contests",label:"Contests"},{href:"/events",label:"Events"},{href:"/businesses",label:"Businesses"}];
const discovery=[{href:"/winners",label:"Winners"},{href:"/blog",label:"Journal"},{href:"/blog/category/daily-quotes",label:"Daily Quotes"},{href:"/videos",label:"Videos"},{href:"/support",label:"Support"}];
const fallbackMobile=[{href:"/",label:"Home"},{href:"/contests",label:"Contests"},{href:"/events",label:"Events"},{href:"/businesses",label:"Businesses"},{href:"/account",label:"Account"}];
const required=[...primary,...discovery];

function mergeNav(configured:any[]){
 const seen=new Set<string>();const out:any[]=[];
 [...configured,...required].forEach(item=>{if(item?.href&&!seen.has(item.href)){seen.add(item.href);out.push(item)}});
 return out;
}

export function AppChrome({children}:{children:React.ReactNode}){
 const path=usePathname();const s=useSiteUI();const [menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{setMenuOpen(false)},[path]);
 useEffect(()=>{if(!menuOpen)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenuOpen(false)};window.addEventListener("keydown",close);return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",close)}},[menuOpen]);
 if(path.startsWith("/admin"))return <>{children}</>;
 const configured=Array.isArray(s.desktop_nav_items)&&s.desktop_nav_items.length?s.desktop_nav_items:primary;
 const desktop=useMemo(()=>mergeNav(configured),[configured]);
 const mobile=Array.isArray(s.mobile_bottom_nav_items)&&s.mobile_bottom_nav_items.length?s.mobile_bottom_nav_items:fallbackMobile;
 const supportType=path.startsWith("/contests")?"contest":path.startsWith("/events")?"event":path.startsWith("/businesses")?"business":"general";
 const active=(href:string)=>path===href||(href!=="/"&&path.startsWith(href));
 return <div className={`app-shell ui-header-${s.header_style||"standard"} ui-mobile-${s.mobile_header_style||"compact"}`}>
  <header className="topbar">
   <BrandLogo/>
   <nav className="desktop-nav public-desktop-nav" aria-label="Website navigation">{desktop.map((item:any)=>{const Icon=iconFor(item.href);return <Link href={item.href} key={item.href} className={active(item.href)?"active":""}><Icon size={15}/><span>{item.label}</span></Link>})}</nav>
   <div className="top-actions">
    {s.show_header_videos!==false&&<Link className="icon-action desktop-utility-video" href="/videos" aria-label="Public videos"><PlayCircle size={21}/></Link>}
    {s.show_header_notifications!==false&&<Link className="icon-action" href="/account#notifications" aria-label="Notifications"><Bell size={21}/><span className="notification-dot"/></Link>}
    {s.show_header_account!==false&&<Link className="avatar-action" href="/account" aria-label="My account"><CircleUserRound size={23}/></Link>}
    <button className="public-mobile-menu-button" type="button" aria-label="Open website menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={23}/></button>
   </div>
  </header>
  {menuOpen&&<><button className="public-menu-backdrop" aria-label="Close menu" onClick={()=>setMenuOpen(false)}/><aside className="public-mobile-drawer" aria-label="Website menu">
   <div className="public-drawer-head"><BrandLogo/><button onClick={()=>setMenuOpen(false)} aria-label="Close menu"><X size={22}/></button></div>
   <div className="public-drawer-intro"><small>SRI GAUR NITAI</small><strong>Explore the community</strong><span>Contests, devotional media, events, businesses and spiritual reading.</span></div>
   <nav>
    <section><b>Explore</b>{[...primary,{href:"/winners",label:"Winners"}].map(item=>{const Icon=iconFor(item.href);return <Link href={item.href} key={item.href} className={active(item.href)?"active":""}><span><Icon size={18}/></span><div><strong>{item.label}</strong><small>{item.href==="/contests"?"Participate in video contests":item.href==="/events"?"Event video publishing":item.href==="/businesses"?"Trusted community directory":item.href==="/winners"?"See selected winners":"Sri Gaur Nitai home"}</small></div></Link>})}</section>
    <section><b>Read & Watch</b>{[{href:"/blog",label:"Journal"},{href:"/blog/category/daily-quotes",label:"Daily Quotes"},{href:"/videos",label:"Public Videos"}].map(item=>{const Icon=iconFor(item.href);return <Link href={item.href} key={item.href} className={active(item.href)?"active":""}><span><Icon size={18}/></span><div><strong>{item.label}</strong><small>{item.href==="/blog"?"Krishna, bhakti and community articles":item.href.includes("daily-quotes")?"Daily devotional reflections":"Approved community videos"}</small></div></Link>})}</section>
    <section><b>Account & Help</b><Link href="/account" className={active("/account")?"active":""}><span><CircleUserRound size={18}/></span><div><strong>My Account</strong><small>Submissions, notifications and profile</small></div></Link><Link href="/support" className={active("/support")?"active":""}><span><CircleHelp size={18}/></span><div><strong>Support Center</strong><small>Get help with contests, events, business or payments</small></div></Link></section>
   </nav>
  </aside></>}
  <main>{children}</main><SiteFooter/>
  {s.show_context_help!==false&&<Link className="context-support" href={`/support?type=${supportType}`} aria-label="Get support"><CircleHelp size={18}/><span>Help</span></Link>}
  {s.mobile_bottom_nav!==false&&<nav className="bottom-nav" aria-label="Primary navigation">{mobile.map((item:any)=>{const Icon=iconFor(item.href);return <Link href={item.href} key={item.href} className={`nav-item ${active(item.href)?"active":""}`}><Icon size={21} strokeWidth={1.8}/><span>{item.label}</span></Link>})}</nav>}
 </div>
}
