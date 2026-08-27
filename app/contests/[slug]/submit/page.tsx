import { UploadCloud } from "lucide-react";

export default async function ContestSubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="page"><div className="section-head"><div><h2>Submit Contest Video</h2><p>Contest: {slug.replaceAll("-", " ")}</p></div></div><div className="form-card"><UploadCloud size={30}/><div className="field"><label>Video title</label><input placeholder="Enter your video title"/></div><div className="field"><label>Description</label><textarea rows={4} placeholder="Tell us about this submission"/></div><div className="field"><label>Video file</label><input type="file" accept="video/mp4,video/quicktime,video/webm"/></div><div className="field"><label><input type="checkbox"/> I accept the contest rules and terms.</label></div><button className="btn btn-primary" type="button">Continue to Submit</button><p style={{fontSize:11,color:"var(--muted)"}}>Mux direct-upload activation is scaffolded for the production media step; API credentials are not stored in this public repository.</p></div></div>;
}
