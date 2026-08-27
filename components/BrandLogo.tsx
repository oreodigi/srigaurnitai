import Link from "next/link";

const transparentLogoIcon = "/api/brand-icon";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  const content = <><span className="brand-logo-icon"><img src={transparentLogoIcon} alt="" /></span>{!compact && <span className="brand-logo-copy"><strong>Sri Gaur Nitai</strong><small>Spirituality • Creativity • Community</small></span>}</>;
  return <Link href="/" className={compact ? "brand-logo compact" : "brand-logo"} aria-label="Sri Gaur Nitai home">{content}</Link>;
}

export function BrandIcon({ size = 72 }: { size?: number }) {
  return <img src={transparentLogoIcon} alt="Sri Gaur Nitai" style={{ width: size, height: size, objectFit: "contain" }} />;
}
