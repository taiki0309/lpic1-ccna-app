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
    <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md px-4 py-3 transition-colors duration-300">
      {/* 左側：明確で分かりやすいアプリ名ロゴテキスト */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-1.5 font-extrabold text-[var(--foreground)] text-sm tracking-tight transition-all hover:border-[var(--accent-primary)] hover:shadow-sm border border-[var(--border)]"
        >
          <span className="text-base" role="img" aria-label="shield">
            🛡️
          </span>
          <span className="font-extrabold tracking-wide">
            ITインフラ技術者認定学習アプリ
          </span>
        </Link>
      </div>

      {/* 右側：テーマ切替(ライト/ダークのみ) ＆ ユーザー認証 */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle iconOnly={false} />
        <Suspense fallback={<div className="h-8 w-16 skeleton" />}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}
