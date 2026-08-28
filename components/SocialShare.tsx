"use client";

import { useState } from "react";
import { Check, Copy, Facebook, Linkedin, MessageCircle, Send, Share2 } from "lucide-react";
import {useSiteUI} from "@/components/SiteUI";

type Props={title:string;description?:string;url?:string;compact?:boolean};
export function SocialShare({title,description="",url,compact=false}:Props){
 const s=useSiteUI();const [copied,setCopied]=useState(false);if(s.show_social_share===false)return null;
 const shareUrl=url||(typeof window!=="undefined"?window.location.href:"");const text=[title,description].filter(Boolean).join(" — ");const u=encodeURIComponent(shareUrl),t=encodeURIComponent(text);const open=(href:string)=>window.open(href,"_blank","noopener,noreferrer,width=720,height=640");
 async function nativeShare(){if(navigator.share){try{await navigator.share({title,text:description,url:shareUrl});return}catch{}}await copy()}async function copy(){await navigator.clipboard.writeText(shareUrl);setCopied(true);setTimeout(()=>setCopied(false),1800)}
 return <section className={compact?"social-share compact":"social-share"} aria-label="Share this page">{!compact&&<div className="social-share-heading"><div className="social-share-icon"><Share2 size={18}/></div><div><strong>Share this page</strong><span>Send it instantly to friends, family or your community.</span></div></div>}<div className="social-share-actions"><button type="button" className="share-whatsapp" onClick={()=>open(`https://wa.me/?text=${t}%20${u}`)} aria-label="Share on WhatsApp"><MessageCircle size={18}/><span>WhatsApp</span></button><button type="button" onClick={()=>open(`https://www.facebook.com/sharer/sharer.php?u=${u}`)} aria-label="Share on Facebook"><Facebook size={18}/><span>Facebook</span></button><button type="button" onClick={()=>open(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`)} aria-label="Share on LinkedIn"><Linkedin size={18}/><span>LinkedIn</span></button><button type="button" onClick={()=>open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`)} aria-label="Share on X"><Send size={18}/><span>X</span></button><button type="button" onClick={copy} aria-label="Copy page link">{copied?<Check size={18}/>:<Copy size={18}/>}<span>{copied?"Copied":"Copy Link"}</span></button><button type="button" className="share-native" onClick={nativeShare} aria-label="More sharing options"><Share2 size={18}/><span>More</span></button></div></section>
}
