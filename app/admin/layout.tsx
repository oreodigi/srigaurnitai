import AdminPersistentShell from "./AdminPersistentShell";
import "./admin-shell.css";

export default function AdminLayout({children}:{children:React.ReactNode}){
 return <AdminPersistentShell>{children}</AdminPersistentShell>;
}
