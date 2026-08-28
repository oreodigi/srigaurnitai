import Link from "next/link";
import {Share2} from "lucide-react";
import ReviewWorkspace from "@/components/ReviewWorkspace";
import "../review.css";
export default function EventReviewsPage(){return <><div className="review-social-shortcut"><Link href="/admin/social"><Share2 size={15}/>Promote approved event content</Link></div><ReviewWorkspace mode="event"/></>}
