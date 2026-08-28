"use client";
import Link from "next/link";
import { FileText, Headphones, MessagesSquare, PlugZap, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";
export function AdminUtilityLinks(){return <div className="admin-utility-links"><Link href="/admin/users"><UsersRound size={16}/> Site Users</Link><Link href="/admin/staff"><ShieldCheck size={16}/> Staff & Roles</Link><Link href="/admin/support"><Headphones size={16}/> Support</Link><Link href="/admin/enquiries"><MessagesSquare size={16}/> Enquiries</Link><Link href="/admin/integrations"><PlugZap size={16}/> Integrations</Link><Link href="/admin/pages"><FileText size={16}/> Pages</Link><Link href="/admin/advanced"><SlidersHorizontal size={16}/> Advanced</Link></div>}
