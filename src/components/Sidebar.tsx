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
        imgSrc: "/characters/teacher.png",
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
      {/* ナビゲーションヘッダー（ちびキャラ女の子アイコン付き） */}
      <div className="w-full px-3 mb-2">
        <div className="flex items-center gap-2.5 rounded-2xl bg-[var(--surface-2)] p-2 border border-[var(--border)] shadow-sm">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--accent-primary)] shrink-0 bg-white">
            <Image
              src="/characters/boy.png"
              alt="学習アシスタント"
              fill
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[var(--foreground)] truncate">
              学習サポート
            </p>
            <p className="text-[10px] text-[var(--accent-primary)] font-bold truncate">
              今日も一緒に頑張ろう！
            </p>
          </div>
        </div>
      </div>

      {/* メインナビ */}
      <nav className="sidebar-nav pt-1" aria-label="メインナビゲーション">
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
                  {item.imgSrc ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[var(--border)] bg-white">
                      <Image
                        src={item.imgSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                  ) : (
                    <span className="sidebar-icon">{item.icon}</span>
                  )}
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
