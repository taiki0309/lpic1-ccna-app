"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

    </aside>
  );
}
