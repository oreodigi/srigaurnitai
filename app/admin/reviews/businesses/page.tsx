import Link from "next/link";
import {Share2} from "lucide-react";
import BusinessReviewWorkspace from "@/components/BusinessReviewWorkspace";
import "../review.css";
export default function BusinessReviewsPage(){return <><div className="review-social-shortcut"><Link href="/admin/social"><Share2 size={15}/>Promote approved businesses</Link></div><BusinessReviewWorkspace/></>}
