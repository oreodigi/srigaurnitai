import type { Metadata, Viewport } from "next";
import { AppChrome } from "@/components/AppChrome";
import "./globals.css";
import "./functional.css";
import "./polish.css";
import "./mobile-fixes.css";
import "./desktop.css";
import "./support/support.css";
import "./admin/admin.css";
import "./admin/support/support-admin.css";
import "./admin/enquiries/enquiries-admin.css";

export const metadata: Metadata = {
  title: "Sri Gaur Nitai",
  description: "Spiritual contests, event video publishing, community videos and trusted businesses.",
  applicationName: "Sri Gaur Nitai",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#720b32" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppChrome>{children}</AppChrome></body></html>;
}
