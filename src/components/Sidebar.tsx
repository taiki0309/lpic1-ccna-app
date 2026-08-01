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
  const { authStatus, user, signOut } = useAuthenticator((ctx) => [ctx.authStatus, ctx.user]);
  const router = useRouter();
  const pathname = usePathname();

  const getDisplayName = (usr: any): string => {
    if (!usr) return 'ユーザー';
    const customName =
      usr.attributes?.name ||
      usr.attributes?.preferred_username ||
      usr.attributes?.nickname ||
      usr.attributes?.given_name ||
      usr.name ||
      usr.displayName;
    if (typeof customName === 'string' && customName.trim().length > 0) {
      return customName.trim();
    }
    const id =
      usr.signInDetails?.loginId ||
      usr.attributes?.email ||
      usr.username ||
      'ユーザー';
    if (typeof id === 'string') {
      if (id.includes('@')) {
        return id.split('@')[0];
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id)) {
        return '学習者';
      }
      return id;
    }
    return 'ユーザー';
  };

  if (authStatus === "authenticated") {
    const name = getDisplayName(user);
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold text-[var(--accent-primary)] break-all text-center" title={`ログイン中: ${name}さん`}>
          👋 こんにちは、{name}さん
        </div>
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
      </div>
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
  if (pathname === "/login") return null;

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
