"use client";

import { FormEvent, useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterBusinessPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    Promise.all([
      supabase.from("business_categories").select("id,name").eq("is_active", true).order("sort_order"),
      supabase.from("business_plans").select("id,name,monthly_price").eq("is_active", true).order("priority"),
    ]).then(([a,b]) => { setCategories(a.data ?? []); setPlans(b.data ?? []); });
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setMessage("Please login before registering a business."); return; }
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}-${Date.now().toString().slice(-5)}`;
    const { error } = await supabase.from("businesses").insert({
      owner_user_id: auth.user.id,
      name,
      slug,
      category_id: fd.get("category_id") || null,
      plan_id: fd.get("plan_id") || null,
      contact_person: fd.get("contact_person"),
      description: fd.get("description"),
      phone: fd.get("phone"),
      whatsapp: fd.get("whatsapp"),
      email: fd.get("email"),
      address: fd.get("address"),
      city: fd.get("city"),
      state: fd.get("state"),
      pincode: fd.get("pincode"),
      status: "pending",
    });
    setMessage(error ? error.message : "Business submitted for review. Payment/subscription activation follows approval workflow.");
  }

  return <div className="page"><div className="section-head"><div><h2>Register Your Business</h2><p>Create the profile first; photos, videos, maps and payment continue in the management flow.</p></div></div><form className="form-card" onSubmit={submit}><BriefcaseBusiness size={30}/><div className="field"><label>Business name</label><input name="name" required/></div><div className="field"><label>Category</label><select name="category_id" required><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="field"><label>Plan</label><select name="plan_id"><option value="">Select later</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name} — ₹{Number(p.monthly_price).toLocaleString("en-IN")}/month</option>)}</select></div><div className="field"><label>Contact person</label><input name="contact_person"/></div><div className="field"><label>Description</label><textarea name="description" rows={4}/></div><div className="field"><label>Phone</label><input name="phone" inputMode="tel"/></div><div className="field"><label>WhatsApp</label><input name="whatsapp" inputMode="tel"/></div><div className="field"><label>Email</label><input name="email" type="email"/></div><div className="field"><label>Address</label><textarea name="address" rows={3}/></div><div className="quick-grid"><div className="field"><label>City</label><input name="city"/></div><div className="field"><label>State</label><input name="state"/></div></div><div className="field"><label>PIN code</label><input name="pincode" inputMode="numeric"/></div><button className="btn btn-primary" type="submit">Submit Business</button>{message && <p style={{fontSize:12,color:"var(--muted)"}}>{message}</p>}</form></div>;
}
