"use client";

import { Share2 } from "lucide-react";

export function ShareProfileButton({ title }: { title: string }) {
  async function share(){
    const url=window.location.href;
    if(navigator.share){
      try{await navigator.share({title,text:`View ${title} on Sri Gaur Nitai`,url});return;}catch{}
    }
    await navigator.clipboard?.writeText(url);
    alert("Profile link copied.");
  }
  return <button className="btn btn-outline" type="button" onClick={share}><Share2 size={15}/> Share Profile</button>;
}
