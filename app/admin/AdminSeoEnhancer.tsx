"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type MapRow={id:string;label:string};

export default function AdminSeoEnhancer(){
 useEffect(()=>{
  let maps:Record<string,MapRow[]>={contests:[],events:[],businesses:[]};
  let stopped=false;
  Promise.all([
   supabase.from("contests").select("id,title"),
   supabase.from("event_categories").select("id,name"),
   supabase.from("businesses").select("id,name")
  ]).then(([c,e,b])=>{if(stopped)return;maps={contests:(c.data||[]).map((r:any)=>({id:r.id,label:r.title})),events:(e.data||[]).map((r:any)=>({id:r.id,label:r.name})),businesses:(b.data||[]).map((r:any)=>({id:r.id,label:r.name}))};enhance()});

  const typeForTitle=(title:string)=>title==="Contests"?"contests":title==="Event Categories"?"events":title==="Businesses"?"businesses":"";
  const hrefFor=(type:string,id:string)=>type==="contests"?`/admin/contests/${encodeURIComponent(id)}/seo`:type==="events"?`/admin/events/${encodeURIComponent(id)}/seo`:`/admin/businesses/${encodeURIComponent(id)}/seo`;
  const findRow=(type:string,label:string)=>maps[type]?.find(x=>x.label.trim()===label.trim());

  function enhance(){
   const title=(document.querySelector(".ma-section-head h2")?.textContent||"").trim();
   const type=typeForTitle(title);
   if(type){
    document.querySelectorAll(".ma-resource-list article").forEach(article=>{
     if(article.querySelector(".ma-inline-seo"))return;
     const label=(article.querySelector("strong")?.textContent||"").trim();
     const row=findRow(type,label); if(!row)return;
     const actions=article.querySelector(".ma-actions"); if(!actions)return;
     const a=document.createElement("a");a.className="ma-inline-seo";a.href=hrefFor(type,row.id);a.textContent="Advanced SEO";a.setAttribute("aria-label",`Advanced SEO for ${label}`);actions.insertBefore(a,actions.firstChild);
    });
   }
  }

  const obs=new MutationObserver(()=>enhance());obs.observe(document.body,{childList:true,subtree:true});enhance();
  return()=>{stopped=true;obs.disconnect()}
 },[]);
 return null;
}
