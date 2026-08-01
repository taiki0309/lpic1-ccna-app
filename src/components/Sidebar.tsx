"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";

const menuGroups = [
  {
    title: "学習コース・教材",
    items: [
      { href: "/", label: "ホーム", icon: "🏠", exact: true },
      { href: "/lpic1", label: "LPIC-1 コース", icon: "🐧" },
      { href: "/ccna", label: "CCNA コース", icon: "🌐" },
    ],
  },
  {
    title: "学習管理・演習",
    items: [
      { href: "/dashboard", label: "学習進捗・成績", icon: "📊" },
      { href: "/quiz", label: "総合演習・実戦テスト", icon: "📝" },
    ],
  },
];

function SidebarAuthActions() {
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
        className="sidebar-item !text-red-400 hover:!bg-red-500/10 transition-colors"
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

  if (pathname === "/login") return null;

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <aside className="sidebar">
      {/* メインナビ */}
      <nav className="sidebar-nav pt-4" aria-label="メインナビゲーション">
        {menuGroups.map((group) => (
          <div key={group.title} className="w-full mb-3">
            <div className="sidebar-category-title">{group.title}</div>
            <div className="flex flex-col gap-1 mt-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item${
                    isActive(item.href, item.exact) ? " active" : ""
                  }`}
                  title={item.label}
                  aria-current={isActive(item.href, item.exact) ? "page" : undefined}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 下部：ログイン/ログアウト */}
      <div className="sidebar-bottom">
        <Suspense
          fallback={
            <div className="sidebar-item">
              <span className="sidebar-icon">👤</span>
              <span>...</span>
            </div>
          }
        >
          <SidebarAuthActions />
        </Suspense>
      </div>
    </aside>
  );
}
