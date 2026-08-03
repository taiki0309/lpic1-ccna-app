"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuGroups = [
  {
    title: "学習コース・教材",
    items: [
      {
        href: "/",
        label: "ホーム",
        icon: "🏠",
        imgSrc: "/characters/boy.png",
        exact: true,
      },
      {
        href: "/lpic1",
        label: "LPIC-1 コース",
        icon: "🐧",
        imgSrc: "/characters/lpic.png",
      },
      {
        href: "/ccna",
        label: "CCNA コース",
        icon: "🌐",
        imgSrc: "/characters/ccna.png",
      },
    ],
  },
  {
    title: "学習管理・演習",
    items: [
      {
        href: "/dashboard",
        label: "学習進捗・成績",
        icon: "📊",
        imgSrc: "/characters/advisor.png",
      },
      {
        href: "/quiz",
        label: "総合演習・実戦テスト",
        icon: "📝",
        imgSrc: "/characters/teacher.png",
      },
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
      {/* ナビゲーションヘッダー（ちびキャラ男の子アイコン付き・トップページへ戻るリンク） */}
      <div className="w-full px-3 mb-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-2.5 border border-[var(--border)] shadow-sm hover:opacity-85 transition-opacity"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent-primary)] shrink-0 bg-white shadow-md">
            <Image
              src="/characters/boy.png"
              alt="学習アシスタント"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--foreground)] truncate">
              学習サポート
            </p>
            <p className="text-xs text-[var(--accent-primary)] font-bold truncate">
              今日も一緒に頑張ろう！
            </p>
          </div>
        </Link>
      </div>

      {/* メインナビ */}
      <nav className="sidebar-nav pt-1" aria-label="メインナビゲーション">
        {menuGroups.map((group) => (
          <div key={group.title} className="w-full mb-4">
            <div className="sidebar-category-title">{group.title}</div>
            <div className="flex flex-col gap-1.5 mt-1">
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
                  {item.imgSrc ? (
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden shrink-0 border-2 border-[var(--border)] bg-white shadow-sm">
                      <Image
                        src={item.imgSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <span className="sidebar-icon text-2xl">{item.icon}</span>
                  )}
                  <span className="truncate font-extrabold text-base">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
