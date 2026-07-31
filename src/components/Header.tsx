"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/lpic1", label: "LPIC-1", icon: "🐧" },
    { href: "/ccna", label: "CCNA", icon: "🌐" },
    { href: "/dashboard", label: "ダッシュボード", icon: "📊" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* ロゴ */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-105"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-black text-white shadow-md"
            style={{
              background:
                "linear-gradient(135deg, #58a6ff 0%, #bc8cff 50%, #3fb950 100%)",
            }}
          >
            C
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[var(--foreground)]">
            CertPath
          </span>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--surface-2)] text-[var(--accent-primary)] font-semibold shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* テーマ切り替え & ログインボタン */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Suspense
              fallback={
                <div className="h-9 w-28 animate-pulse rounded-xl bg-[var(--surface-2)]" />
              }
            >
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
