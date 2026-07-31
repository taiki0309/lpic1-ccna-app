"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", icon: "🏠", label: "ホーム", exact: true },
  { href: "/lpic1", icon: "🐧", label: "LPIC-1" },
  { href: "/ccna", icon: "🌐", label: "CCNA" },
  { href: "/dashboard", icon: "📊", label: "進捗" },
  { href: "/quiz", icon: "📝", label: "演習" },
];

const bottomItems = [
  { href: "/login", icon: "👤", label: "アカウント" },
];

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

      {/* テーマ切り替え */}
      <div className="sidebar-bottom">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item${isActive(item.href) ? " active" : ""}`}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="sidebar-item" style={{ padding: "8px 4px" }}>
          <ThemeToggle compact />
        </div>
      </div>
    </aside>
  );
}
