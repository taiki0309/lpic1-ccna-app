"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", icon: "🏠", label: "ホーム", exact: true },
  { href: "/lpic1", icon: "🐧", label: "LPIC-1" },
  { href: "/ccna", icon: "🌐", label: "CCNA" },
  { href: "/dashboard", icon: "📊", label: "進捗" },
  { href: "/quiz", icon: "📝", label: "演習" },
];

function SidebarAccountButton() {
  const { authStatus, signOut } = useAuthenticator((ctx) => [ctx.authStatus]);
  const router = useRouter();
  const pathname = usePathname();

  if (authStatus === "authenticated") {
    return (
      <button
        type="button"
        onClick={() => {
          signOut();
          router.push("/login");
        }}
        className="sidebar-item"
        title="ログアウト"
      >
        <span className="sidebar-icon">🔓</span>
        <span>ログアウト</span>
      </button>
    );
  }

  const isActive = pathname?.startsWith("/login");
  return (
    <Link
      href="/login"
      className={`sidebar-item${isActive ? " active" : ""}`}
      title="ログイン / 新規登録"
    >
      <span className="sidebar-icon">🔐</span>
      <span>ログイン</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <aside className="sidebar">
      {/* ロゴ */}
      <Link href="/" className="sidebar-logo" title="LPIC×CCNA 学習室">
        📚
      </Link>

      {/* メインナビ */}
      <nav className="sidebar-nav" aria-label="メインナビゲーション">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item${isActive(item.href, item.exact) ? " active" : ""}`}
            title={item.label}
            aria-current={isActive(item.href, item.exact) ? "page" : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 区切り線 */}
      <div className="sidebar-divider" />

      {/* 下部：ログイン/ログアウト & テーマ切替 */}
      <div className="sidebar-bottom">
        <Suspense
          fallback={
            <div className="sidebar-item">
              <span className="sidebar-icon">👤</span>
              <span>...</span>
            </div>
          }
        >
          <SidebarAccountButton />
        </Suspense>
        <div className="sidebar-item" style={{ padding: "8px 4px" }}>
          <ThemeToggle compact />
        </div>
      </div>
    </aside>
  );
}
