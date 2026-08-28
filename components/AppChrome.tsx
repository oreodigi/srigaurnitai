"use client";
import Link from "next/link";
import { Bell, BriefcaseBusiness, CalendarHeart, CircleHelp, CircleUserRound, Home, PlayCircle, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import {useSiteUI} from "@/components/SiteUI";
const iconFor=(href:string)=>href==="/contests"?Trophy:href==="/events"?CalendarHeart:href==="/businesses"?BriefcaseBusiness:href==="/account"?CircleUserRound:Home;
const fallback=[{href:"/",label:"Home"},{href:"/contests",label:"Contests"},{href:"/events",label:"Events"},{href:"/businesses",label:"Businesses"}];
const fallbackMobile=[...fallback,{href:"/account",label:"Account"}];
export function AppChrome({children}:{children:React.ReactNode}){
 const path=usePathname();const s=useSiteUI();if(path.startsWith("/admin"))return <>{children}</>;
 const desktop=Array.isArray(s.desktop_nav_items)&&s.desktop_nav_items.length?s.desktop_nav_items:fallback;
 const mobile=Array.isArray(s.mobile_bottom_nav_items)&&s.mobile_bottom_nav_items.length?s.mobile_bottom_nav_items:fallbackMobile;
 const supportType=path.startsWith("/contests")?"contest":path.startsWith("/events")?"event":path.startsWith("/businesses")?"business":"general";
 return <div className={`app-shell ui-header-${s.header_style||"standard"} ui-mobile-${s.mobile_header_style||"compact"}`}><header className="topbar"><BrandLogo/><nav className="desktop-nav" aria-label="Desktop navigation">{desktop.map((item:any)=>{const Icon=iconFor(item.href);return <Link href={item.href} key={item.href} className={path===item.href||item.href!=="/"&&path.startsWith(item.href)?"active":""}><Icon size={16}/><span>{item.label}</span></Link>})}</nav><div className="top-actions">{s.show_header_videos!==false&&<Link className="icon-action" href="/videos" aria-label="Public videos"><PlayCircle size={21}/></Link>}{s.show_header_notifications!==false&&<Link className="icon-action" href="/account#notifications" aria-label="Notifications"><Bell size={21}/><span className="notification-dot"/></Link>}{s.show_header_account!==false&&<Link className="avatar-action" href="/account" aria-label="My account"><CircleUserRound size={23}/></Link>}</div></header><main>{children}</main><SiteFooter/>{s.show_context_help!==false&&<Link className="context-support" href={`/support?type=${supportType}`} aria-label="Get support"><CircleHelp size={18}/><span>Help</span></Link>}{s.mobile_bottom_nav!==false&&<nav className="bottom-nav" aria-label="Primary navigation">{mobile.map((item:any)=>{const Icon=iconFor(item.href);return <Link href={item.href} key={item.href} className="nav-item"><Icon size={21} strokeWidth={1.8}/><span>{item.label}</span></Link>})}</nav>}</div>}
