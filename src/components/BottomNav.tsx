"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  imgSrc?: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ホーム", icon: "🏠", imgSrc: "/characters/boy.png", exact: true },
  { href: "/lpic1", label: "LPIC-1", icon: "🐧", imgSrc: "/characters/lpic.png" },
  { href: "/ccna", label: "CCNA", icon: "🌐", imgSrc: "/characters/ccna.png" },
  { href: "/quiz", label: "総合演習", icon: "📝", imgSrc: "/characters/teacher.png" },
  { href: "/dashboard", label: "学習管理", icon: "📊", imgSrc: "/characters/advisor.png" },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--border)] bg-[var(--surface)] px-2 py-2 shadow-xl xl:hidden"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center rounded-2xl py-1.5 transition-all ${
              active
                ? "text-[var(--accent-primary)] font-black scale-105"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)] font-bold"
            }`}
          >
            {item.imgSrc ? (
              <div
                className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-2xl overflow-hidden mb-1 border-2 ${
                  active
                    ? "border-[var(--accent-primary)] shadow-md bg-white"
                    : "border-[var(--border)] bg-white/90"
                }`}
              >
                <Image
                  src={item.imgSrc}
                  alt={item.label}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            ) : (
              <span className="text-2xl leading-none mb-1">{item.icon}</span>
            )}
            <span className="text-xs leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
