"use client";
import Link from "next/link";
import { Headphones, SearchCheck, ShieldCheck, UsersRound, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
const modules = [["Website UI","/admin/ui",Palette],["SEO & Social","/admin/seo",SearchCheck],["Support System","/admin/support",Headphones],["Users","/admin/users",UsersRound],["Staff & Roles","/admin/staff",ShieldCheck]] as const;
export default function AdminSidebarModules(){const [target,setTarget]=useState<HTMLElement|null>(null);useEffect(()=>{const find=()=>setTarget(document.querySelector<HTMLElement>(".ma-side nav"));find();const id=window.setInterval(find,250);return()=>window.clearInterval(id)},[]);if(!target)return null;return createPortal(<div className="ma-core-modules"><small className="ma-nav-title">SYSTEM</small>{modules.map(([label,href,Icon])=><Link className="ma-side-link ma-core-link" href={href} key={href}><Icon size={17}/><span>{label}</span></Link>)}</div>,target)}
