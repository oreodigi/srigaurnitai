"use client";

import { FormEvent, useEffect, useState } from "react";
import { CircleUserRound, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault(); setMessage("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in successfully.");
  }

  async function signUp() {
    setMessage("Creating account...");
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Account created. Check your email if confirmation is enabled.");
  }

  if (userEmail) return <div className="page"><div className="section-head"><div><h2>My Account</h2><p>{userEmail}</p></div></div><div className="quick-grid"><div className="quick-card"><strong>My Contests</strong><span>Track submissions, shortlists and prizes.</span></div><div className="quick-card"><strong>My Events</strong><span>Track review, publishing and YouTube links.</span></div><div className="quick-card"><strong>My Businesses</strong><span>Manage listings and renew subscriptions.</span></div><div className="quick-card"><strong>Payments & Payouts</strong><span>Transactions, invoices and payout details.</span></div></div><div className="section form-card"><button className="btn" onClick={() => supabase.auth.signOut()}><LogOut size={16}/> Sign out</button></div></div>;

  return <div className="page"><div className="section-head"><div><h2>Login to Sri Gaur Nitai</h2><p>Your contests, events, businesses and payments in one account.</p></div></div><form className="form-card" onSubmit={signIn}><CircleUserRound size={30}/><div className="field"><label>Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></div><div className="field"><label>Password</label><input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 6 characters" /></div><div className="hero-actions"><button className="btn btn-primary" type="submit">Login</button><button className="btn" type="button" onClick={signUp}>Create account</button></div>{message && <p style={{fontSize:12, color:"var(--muted)"}}>{message}</p>}</form></div>;
}
