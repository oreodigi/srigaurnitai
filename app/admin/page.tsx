import "./admin-master.css";
import AdminMasterConsole from "./AdminMasterConsole";

export default function AdminPage(){
  return <><AdminMasterConsole/><a href="/admin/advanced" style={{position:"fixed",right:16,bottom:16,zIndex:140,background:"#111827",color:"white",padding:"10px 14px",borderRadius:10,fontSize:12,fontWeight:800,textDecoration:"none",boxShadow:"0 10px 30px rgba(0,0,0,.22)"}}>Advanced Data Control</a></>;
}
