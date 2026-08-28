import Link from "next/link";
import { SearchCheck } from "lucide-react";
import "./admin-master.css";
import AdminMasterConsole from "./AdminMasterConsole";
import AdminSeoEnhancer from "./AdminSeoEnhancer";

export default function AdminPage(){
  return <><AdminMasterConsole/><AdminSeoEnhancer/><Link className="admin-seo-fab" href="/admin/seo"><SearchCheck size={17}/><span>SEO Center</span></Link></>;
}
