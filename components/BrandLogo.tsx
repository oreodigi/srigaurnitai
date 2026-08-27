import Link from "next/link";

const transparentLogoIcon = "/sgn-emblem.svg?v=1";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={compact ? "brand-logo compact" : "brand-logo"} aria-label="Sri Gaur Nitai home">
    <span className="brand-logo-icon"><img src={transparentLogoIcon} alt="Sri Gaur Nitai emblem" /></span>
    {!compact && <span className="brand-logo-copy"><strong>Sri Gaur Nitai</strong><small>Spirituality • Creativity • Community</small></span>}
  </Link>;
}

export function BrandIcon({ size = 72 }: { size?: number }) {
  return <img src={transparentLogoIcon} alt="Sri Gaur Nitai" width={size} height={size} style={{ width: size, height: size, objectFit: "contain", display: "block" }} />;
}
