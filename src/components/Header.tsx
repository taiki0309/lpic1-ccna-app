"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import MobileDrawer from "./MobileDrawer";

// Top bar visible on mobile & provides drawer trigger
export default function Header() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (pathname === "/login") return null;

  const navLinks = [
    { href: "/lpic1", label: "LPIC-1", icon: "🐧" },
    { href: "/ccna", label: "CCNA", icon: "🌐" },
    { href: "/dashboard", label: "進捗", icon: "📊" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md px-3 py-2.5 transition-colors duration-300">
        {/* 左側：スマホで開いた時に社内ポータルみたいに左にバーを持ってくるドロワーボタン ＆ ロゴ */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs font-extrabold text-[var(--foreground)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all sm:hidden"
            title="メニューを開く"
            aria-label="ドロワーメニューを開く"
          >
            <span className="text-sm">☰</span>
            <span>メニュー</span>
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 font-extrabold text-[var(--foreground)] text-sm tracking-tight whitespace-nowrap"
          >
            <span>📚</span>
            <span className="hidden xs:inline">学習室</span>
          </Link>
        </div>

        {/* モバイル〜タブレット用クイックナビ */}
        <nav className="flex shrink-0 items-center gap-1 sm:hidden">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--surface-2)] text-[var(--accent-primary)] font-bold"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
                title={link.label}
              >
                <span>{link.icon}</span>
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 右側：テーマ切替、ユーザー認証 */}
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle iconOnly={true} />
          <Suspense fallback={<div className="h-8 w-16 skeleton" />}>
            <AuthButton />
          </Suspense>
        </div>
      </header>

      {/* 左から開くドロワーメニューバー */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
