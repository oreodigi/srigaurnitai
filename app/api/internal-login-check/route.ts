import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("token") !== "sgn-check-1931") return NextResponse.json({ok:false},{status:403});
  const email=req.nextUrl.searchParams.get("email")||"";
  const password=req.nextUrl.searchParams.get("password")||"";
  const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vblgtiamlsjqpjaillfn.supabase.co",process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_fyv2fWhRK7bfbBP3sITAww_TFmUOKyl");
  const {data,error}=await supabase.auth.signInWithPassword({email,password});
  if(error)return NextResponse.json({ok:false,error:error.message},{status:400});
  return NextResponse.json({ok:true,id:data.user.id,email:data.user.email});
}
