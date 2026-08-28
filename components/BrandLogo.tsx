"use client";
import Link from "next/link";
import {useSiteUI} from "@/components/SiteUI";

const fallback = "/sgn-emblem.svg?v=1";
export function BrandLogo({ compact = false }: { compact?: boolean }) {
  const s=useSiteUI();
  const src=s.header_logo_url||s.desktop_logo_url||fallback;
  return <Link href="/" className={compact ? "brand-logo compact" : "brand-logo"} aria-label={`${s.site_name||"Sri Gaur Nitai"} home`}>
    {s.show_header_logo!==false&&<span className="brand-logo-icon"><picture>{s.mobile_logo_url&&<source media="(max-width:1023px)" srcSet={s.mobile_logo_url}/>}<img src={src} alt={`${s.site_name||"Sri Gaur Nitai"} emblem`} /></picture></span>}
    {!compact && s.show_header_site_name!==false && <span className="brand-logo-copy"><strong>{s.site_name||"Sri Gaur Nitai"}</strong>{s.show_header_tagline!==false&&<small className={s.mobile_show_tagline===false?"mobile-hide-tagline":""}>Spirituality • Creativity • Community</small>}</span>}
  </Link>;
}

export function BrandIcon({ size = 72 }: { size?: number }) {
  const s=useSiteUI();const src=s.splash_logo_url||s.mobile_logo_url||s.header_logo_url||fallback;
  return <img src={src} alt={s.site_name||"Sri Gaur Nitai"} width={size} height={size} style={{ width: size, height: size, objectFit: "contain", display: "block" }} />;
}
