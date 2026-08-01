"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-300">
      {/* 左側：明確で分かりやすいアプリタイトル（ロゴアイコンなし・テキストのみ・絶対折り返し防止） */}
      <div className="flex items-center shrink-0 min-w-0">
        <Link
          href="/"
          className="font-extrabold text-sm sm:text-base text-[var(--foreground)] tracking-tight whitespace-nowrap hover:text-[var(--accent-primary)] transition-colors"
        >
          <span className="sm:hidden">ITインフラ学習アプリ</span>
          <span className="hidden sm:inline">ITインフラ技術者認定学習アプリ</span>
        </Link>
      </div>

      {/* 右側：テーマ切替(ライト/ダークのみ) ＆ ユーザー認証 */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <ThemeToggle iconOnly={false} />
        <Suspense fallback={<div className="h-8 w-16 skeleton" />}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}
