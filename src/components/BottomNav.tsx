"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ホーム", icon: "🏠", exact: true },
  { href: "/lpic1", label: "LPIC-1", icon: "🐧" },
  { href: "/ccna", label: "CCNA", icon: "🌐" },
  { href: "/dashboard", label: "学習管理", icon: "📊" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 shadow-lg lg:hidden"
      style={{
        paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center rounded-xl py-1 transition-all ${
              active
                ? "text-[var(--accent-primary)] font-extrabold scale-105"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className="text-xl leading-none mb-1">{item.icon}</span>
            <span className="text-[10px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
