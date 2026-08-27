import { BrandIcon } from "@/components/BrandLogo";

export default function Loading() {
  return <div className="app-loader"><div className="loader-icon"><BrandIcon size={86}/></div><div className="loader-line"><span/></div></div>;
}
