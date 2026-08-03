"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-300">
      {/* 左側：ちびキャラ男の子ロゴアイコン ＋ 明確なアプリタイトル */}
      <div className="flex items-center shrink-0 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-85 transition-opacity"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[var(--accent-primary)] shrink-0 bg-white shadow-md">
            <Image
              src="/characters/boy.png"
              alt="ちびキャラ男の子ロゴ"
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </div>
          <span className="font-extrabold text-base sm:text-lg text-[var(--foreground)] tracking-tight whitespace-nowrap">
            <span className="sm:hidden">ITインフラ学習アプリ</span>
            <span className="hidden sm:inline lg:hidden">ITインフラ学習アプリ</span>
            <span className="hidden lg:inline">ITインフラ技術者認定学習アプリ</span>
          </span>
        </Link>
      </div>

      {/* 右側：テーマ切替(ワンクリック切替) ＆ ユーザー認証 */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2 min-w-0">
        <ThemeToggle iconOnly={true} />
        <Suspense fallback={<div className="h-8 w-16 skeleton" />}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}
