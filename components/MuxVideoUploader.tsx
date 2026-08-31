"use client";

import { useState } from "react";
import { CheckCircle2, UploadCloud, Video } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props={
  value:string;
  onChange:(url:string)=>void;
  disabled?:boolean;
  label?:string;
};

export default function MuxVideoUploader({value,onChange,disabled=false,label="Upload video"}:Props){
  const [progress,setProgress]=useState(0);
  const [status,setStatus]=useState("");
  const [uploading,setUploading]=useState(false);

  async function waitForPlayback(uploadId:string){
    for(let i=0;i<60;i++){
      setStatus(i<2?"Upload complete. Mux is preparing your video…":"Mux is processing your video…");
      await new Promise(r=>setTimeout(r,i<4?2000:4000));
      const {data,error}=await supabase.functions.invoke("mux-create-upload",{body:{action:"status",upload_id:uploadId}});
      if(error)throw error;
      if(data?.error)throw new Error(typeof data.error==="string"?data.error:"Mux processing failed");
      if(data?.status==="errored")throw new Error("Mux could not process this video. Please try another file.");
      if(data?.playback_url){onChange(data.playback_url);setStatus("Video uploaded and ready.");setProgress(100);return;}
    }
    throw new Error("The upload finished but video processing is taking longer than expected. Please try again shortly.");
  }

  async function upload(file:File){
    if(!file.type.startsWith("video/")){setStatus("Please choose a video file.");return;}
    setUploading(true);setProgress(0);setStatus("Creating secure upload…");onChange("");
    try{
      const {data,error}=await supabase.functions.invoke("mux-create-upload",{body:{action:"create",cors_origin:window.location.origin}});
      if(error)throw error;
      if(data?.error)throw new Error(typeof data.error==="string"?data.error:"Mux is not configured");
      if(!data?.upload_url||!data?.upload_id)throw new Error("Mux did not return an upload URL.");

      await new Promise<void>((resolve,reject)=>{
        const xhr=new XMLHttpRequest();
        xhr.open("PUT",data.upload_url,true);
        xhr.setRequestHeader("Content-Type",file.type||"application/octet-stream");
        xhr.upload.onprogress=e=>{if(e.lengthComputable){const pct=Math.round((e.loaded/e.total)*100);setProgress(pct);setStatus(`Uploading… ${pct}%`);}};
        xhr.onerror=()=>reject(new Error("Upload failed. Check your connection and try again."));
        xhr.onload=()=>xhr.status>=200&&xhr.status<300?resolve():reject(new Error(`Upload failed (${xhr.status}).`));
        xhr.send(file);
      });

      await waitForPlayback(data.upload_id);
    }catch(e:any){setProgress(0);setStatus(e?.message||"Video upload failed.");}
    finally{setUploading(false);}
  }

  return <div className="field">
    <label><Video size={14}/> {label}</label>
    <label className="btn soft-btn" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,cursor:uploading||disabled?"not-allowed":"pointer",opacity:uploading||disabled?.65:1}}>
      <UploadCloud size={18}/>{uploading?"Uploading video…":"Choose video from device"}
      <input type="file" accept="video/*" disabled={uploading||disabled} onChange={e=>{const f=e.target.files?.[0];if(f)upload(f);e.currentTarget.value=""}} style={{display:"none"}}/>
    </label>
    {(uploading||progress>0)&&<div style={{height:8,background:"#eee3d4",borderRadius:999,overflow:"hidden",marginTop:10}}><div style={{height:"100%",width:`${progress}%`,background:"var(--brand-maroon,#700831)",transition:"width .2s ease"}}/></div>}
    {status&&<small style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>{value?<CheckCircle2 size={14}/>:null}{status}</small>}
    {value&&<small style={{display:"block",wordBreak:"break-all",marginTop:5}}>Mux playback ready: {value}</small>}
  </div>;
}
