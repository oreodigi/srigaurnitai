import Link from "next/link";
import {Share2} from "lucide-react";
import ReviewWorkspace from "@/components/ReviewWorkspace";
import "../review.css";
export default function ContestReviewsPage(){return <><div className="review-social-shortcut"><Link href="/admin/social"><Share2 size={15}/>Promote approved contest content</Link></div><ReviewWorkspace mode="contest"/></>}
