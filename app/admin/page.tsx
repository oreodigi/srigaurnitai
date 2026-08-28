import "./admin-master.css";
import "./dashboard-v2.css";
import AdminMasterConsole from "./AdminMasterConsole";
import AdminSeoEnhancer from "./AdminSeoEnhancer";
import AdminExperienceEnhancer from "./AdminExperienceEnhancer";
import AdminDashboardV2 from "./AdminDashboardV2";

export default function AdminPage(){
  return <><AdminMasterConsole/><AdminSeoEnhancer/><AdminExperienceEnhancer/><AdminDashboardV2/></>;
}
