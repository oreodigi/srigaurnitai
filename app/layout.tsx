import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bell, BriefcaseBusiness, CalendarDays, CircleUserRound, Home, Search, Trophy } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sri Gaur Nitai",
  description: "Spiritual contests, celebrations, businesses and community opportunities.",
  applicationName: "Sri Gaur Nitai",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf1",
};

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/contests", label: "Contests", icon: Trophy },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/businesses", label: "Businesses", icon: BriefcaseBusiness },
  { href: "/account", label: "Account", icon: CircleUserRound },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <Link className="brand" href="/" aria-label="Sri Gaur Nitai home">
              <span className="lotus-mark">♢</span>
              <span><strong>Sri Gaur Nitai</strong><small>Serve • Share • Inspire</small></span>
            </Link>
            <div className="top-actions">
              <button className="icon-btn" aria-label="Search"><Search size={20}/></button>
              <button className="icon-btn notify" aria-label="Notifications"><Bell size={20}/><i /></button>
              <Link className="avatar" href="/account" aria-label="Account">SG</Link>
            </div>
          </header>
          <main>{children}</main>
          <nav className="bottom-nav" aria-label="Primary navigation">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href} className="nav-item">
                <Icon size={22} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </body>
    </html>
  );
}
