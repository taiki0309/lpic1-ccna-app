"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

// Thin top bar visible on mobile (where sidebar is hidden)
export default function Header() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  const navLinks = [
    { href: "/lpic1", label: "LPIC-1", icon: "🐧" },
    { href: "/ccna", label: "CCNA", icon: "🌐" },
    { href: "/dashboard", label: "進捗", icon: "📊" },
  ];

  return (
    <header className="sticky top-0 z-40 flex sm:hidden w-full items-center justify-between border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md px-4 py-3 transition-colors duration-300">
      {/* ロゴ */}
      <Link href="/" className="flex items-center gap-2 font-extrabold text-[var(--foreground)] text-base tracking-tight">
        📚 <span>学習室</span>
      </Link>

      {/* モバイルナビ */}
      <nav className="flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[var(--surface-2)] text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              }`}
            >
              {link.icon}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Suspense fallback={<div className="h-8 w-16 skeleton" />}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}
