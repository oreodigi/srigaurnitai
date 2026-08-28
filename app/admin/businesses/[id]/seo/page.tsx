import "../../../seo/record.css";
import ListingSeoEditor from "../../../seo/ListingSeoEditor";

export default async function BusinessSeoPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ListingSeoEditor kind="business" id={id}/>}
