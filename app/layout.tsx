import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bell, BriefcaseBusiness, CalendarHeart, CircleUserRound, Home, PlayCircle, Trophy } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import "./globals.css";
import "./functional.css";
import "./polish.css";
import "./mobile-fixes.css";

export const metadata: Metadata = {
  title: "Sri Gaur Nitai",
  description: "Spiritual contests, event video publishing, community videos and trusted businesses.",
  applicationName: "Sri Gaur Nitai",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#720b32" };

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/contests", label: "Contests", icon: Trophy },
  { href: "/events", label: "Events", icon: CalendarHeart },
  { href: "/businesses", label: "Businesses", icon: BriefcaseBusiness },
  { href: "/account", label: "Account", icon: CircleUserRound },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <BrandLogo />
            <div className="top-actions">
              <Link className="icon-action" href="/videos" aria-label="Public videos"><PlayCircle size={21}/></Link>
              <Link className="icon-action" href="/account#notifications" aria-label="Notifications"><Bell size={21}/><span className="notification-dot"/></Link>
              <Link className="avatar-action" href="/account" aria-label="My account"><CircleUserRound size={23}/></Link>
            </div>
          </header>
          <main>{children}</main>
          <nav className="bottom-nav" aria-label="Primary navigation">
            {nav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className="nav-item"><Icon size={21} strokeWidth={1.8}/><span>{label}</span></Link>)}
          </nav>
        </div>
      </body>
    </html>
  );
}
