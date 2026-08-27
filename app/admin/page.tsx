"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const metrics = [
  ["Users", "profiles"],
  ["Contests", "contests"],
  ["Contest Submissions", "contest_submissions"],
  ["Event Submissions", "event_submissions"],
  ["Businesses", "businesses"],
  ["Payments", "payments"],
] as const;

export default function AdminPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [state, setState] = useState("Checking administrator access...");

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return setState("Login with an administrator account to access this dashboard.");
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id).eq("role", "admin").maybeSingle();
      if (!role) return setState("This account does not have administrator access.");
      const results = await Promise.all(metrics.map(async ([label, table]) => {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
        return [label, count ?? 0] as const;
      }));
      setCounts(Object.fromEntries(results));
      setState("Administrator dashboard");
    })();
  }, []);

  return <div className="page"><div className="section-head"><div><h2>Administration</h2><p>{state}</p></div><ShieldCheck/></div>{Object.keys(counts).length ? <><div className="quick-grid">{Object.entries(counts).map(([label,value])=><div className="quick-card" key={label}><strong>{value.toLocaleString("en-IN")}</strong><span>{label}</span></div>)}</div><section className="section"><div className="cards"><div className="card"><div className="card-body"><span className="card-kicker">Moderation</span><h3>Approvals & Review Queue</h3><p>Contest videos, event videos and business listings are controlled through the role-secured database workflow.</p></div></div><div className="card"><div className="card-body"><span className="card-kicker">Commercial</span><h3>Payments & Subscriptions</h3><p>Registration fees, subscriptions, contest fees and event publishing payments share one transaction model.</p></div></div><div className="card"><div className="card-body"><span className="card-kicker">Content</span><h3>CMS & Winners</h3><p>Banners, announcements, winner profiles and publishing status are ready in the backend model.</p></div></div></div></section></> : <div className="empty-state"><ShieldCheck/><h3>Protected Admin Area</h3><p>{state}</p></div>}</div>;
}
