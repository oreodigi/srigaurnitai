"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EventSubmitPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    Promise.all([
      supabase.from("event_categories").select("id,name,base_price").eq("is_active", true).order("sort_order"),
      supabase.from("event_packages").select("id,name,price_modifier").eq("is_active", true).order("sort_order"),
    ]).then(([a,b]) => { setCategories(a.data ?? []); setPackages(b.data ?? []); });
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setMessage("Please login before submitting an event video."); return; }
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("event_submissions").insert({
      user_id: auth.user.id,
      category_id: fd.get("category_id"),
      package_id: fd.get("package_id") || null,
      subject_name: fd.get("subject_name"),
      requested_publish_date: fd.get("requested_publish_date") || null,
      title: fd.get("title"),
      message: fd.get("message"),
      status: "submitted",
    });
    setMessage(error ? error.message : "Event request created. Video upload and payment will follow in the next step.");
  }

  return <div className="page"><div className="section-head"><div><h2>Submit Event Video</h2><p>Create the publishing request from your phone.</p></div></div><form className="form-card" onSubmit={submit}><CalendarHeart size={30}/><div className="field"><label>Event category</label><select name="category_id" required><option value="">Select</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name} — ₹{Number(c.base_price).toLocaleString("en-IN")}</option>)}</select></div><div className="field"><label>Publishing package</label><select name="package_id"><option value="">Standard/default</option>{packages.map(p=><option key={p.id} value={p.id}>{p.name} (+₹{Number(p.price_modifier).toLocaleString("en-IN")})</option>)}</select></div><div className="field"><label>Person / family / business name</label><input name="subject_name" required/></div><div className="field"><label>Requested publish date</label><input name="requested_publish_date" type="date"/></div><div className="field"><label>Video title</label><input name="title"/></div><div className="field"><label>Message</label><textarea name="message" rows={4}/></div><button className="btn btn-primary" type="submit">Create Publishing Request</button>{message && <p style={{fontSize:12,color:"var(--muted)"}}>{message}</p>}</form></div>;
}
