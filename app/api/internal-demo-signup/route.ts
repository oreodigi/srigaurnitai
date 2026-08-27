import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const email = req.nextUrl.searchParams.get("email")?.trim();
  const password = req.nextUrl.searchParams.get("password") ?? "";
  const fullName = req.nextUrl.searchParams.get("name")?.trim() ?? "Demo User";
  if (token !== "sgn-bootstrap-8274") return NextResponse.json({ ok:false }, { status:403 });
  if (!email || password.length < 8) return NextResponse.json({ ok:false, error:"invalid input" }, { status:400 });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vblgtiamlsjqpjaillfn.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_fyv2fWhRK7bfbBP3sITAww_TFmUOKyl");
  const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name:fullName } } });
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 });
  return NextResponse.json({ ok:true, id:data.user?.id ?? null, email:data.user?.email ?? email });
}
