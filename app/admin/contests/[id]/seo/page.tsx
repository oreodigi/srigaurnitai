import "../../../seo/record.css";
import ListingSeoEditor from "../../../seo/ListingSeoEditor";

export default async function ContestSeoPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ListingSeoEditor kind="contest" id={id}/>}
