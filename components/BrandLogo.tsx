import Link from "next/link";

function Emblem({compact=false}:{compact?:boolean}){return <span className={compact?"sgn-emblem compact":"sgn-emblem"} aria-hidden="true"><span className="sgn-arch"/><span className="sgn-figures">♬</span><span className="sgn-lotus">◆</span></span>}

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={compact ? "brand-logo compact" : "brand-logo"} aria-label="Sri Gaur Nitai home"><Emblem compact={compact}/>{!compact && <span className="brand-logo-copy"><strong>Sri Gaur Nitai</strong><small>Spirituality • Creativity • Community</small></span>}</Link>;
}

export function BrandIcon({ size = 72 }: { size?: number }) {
  return <span style={{width:size,height:size,display:"inline-grid",placeItems:"center"}}><Emblem compact/></span>;
}
