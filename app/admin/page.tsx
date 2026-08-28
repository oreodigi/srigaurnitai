import Link from "next/link";
import { SearchCheck } from "lucide-react";
import "./admin-master.css";
import AdminMasterConsole from "./AdminMasterConsole";

export default function AdminPage(){
  return <><AdminMasterConsole/><Link className="admin-seo-fab" href="/admin/seo"><SearchCheck size={16}/>SEO Center</Link></>;
}
