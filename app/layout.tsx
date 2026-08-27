import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BriefcaseBusiness, CalendarHeart, CircleUserRound, Home, Trophy } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sri Gaur Nitai",
  description: "Contests, celebrations, businesses and community opportunities.",
  applicationName: "Sri Gaur Nitai",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7a2418",
};

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
            <Link className="brand" href="/" aria-label="Sri Gaur Nitai home">
              <span className="brand-mark">श्री</span>
              <span><strong>Sri Gaur Nitai</strong><small>Community • Culture • Celebration</small></span>
            </Link>
            <Link className="login-pill" href="/account">Login</Link>
          </header>
          <main>{children}</main>
          <nav className="bottom-nav" aria-label="Primary navigation">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href} className="nav-item">
                <Icon size={21} strokeWidth={1.9} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </body>
    </html>
  );
}
