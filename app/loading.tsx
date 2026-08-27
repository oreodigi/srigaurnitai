import { BrandIcon } from "@/components/BrandLogo";

export default function Loading() {
  return <div className="app-loader">
    <div className="loader-brand"><BrandIcon size={170}/><strong>Sri Gaur Nitai</strong><small>Spirituality • Creativity • Community</small></div>
    <div className="loader-line"><span/></div>
  </div>;
}
