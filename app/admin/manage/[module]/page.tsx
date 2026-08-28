import {notFound} from "next/navigation";
import ModuleManager from "./ModuleManager";
const allowed=new Set(["contests","contest-categories","event-categories","publishing-packages","businesses","business-categories","business-plans","campaigns","content"]);
export default async function Page({params}:{params:Promise<{module:string}>}){const {module}=await params;if(!allowed.has(module))notFound();return <ModuleManager module={module}/>}
