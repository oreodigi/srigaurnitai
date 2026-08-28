import "../../../seo/record.css";
import ListingSeoEditor from "../../../seo/ListingSeoEditor";

export default async function EventSeoPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ListingSeoEditor kind="event" id={id}/>}
