"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import ThemeToggle from "./ThemeToggle";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSystemModal?: () => void;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  onOpenSystemModal,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const { authStatus, user, signOut } = useAuthenticator((ctx) => [
    ctx.authStatus,
    ctx.user,
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getDisplayName = (usr: any): string => {
    if (!usr) return "ユーザー";
    const customName =
      usr.attributes?.name ||
      usr.attributes?.preferred_username ||
      usr.attributes?.nickname ||
      usr.attributes?.given_name ||
      usr.name ||
      usr.displayName;
    if (typeof customName === "string" && customName.trim().length > 0) {
      return customName.trim();
    }
    const id =
      usr.signInDetails?.loginId ||
      usr.attributes?.email ||
      usr.username ||
      "ユーザー";
    if (typeof id === "string") {
      if (id.includes("@")) {
        return id.split("@")[0];
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id)) {
        return "学習者";
      }
      return id;
    }
    return "ユーザー";
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  const menuGroups = [
    {
      title: "学習コース・教材",
      icon: "📚",
      items: [
        { href: "/", label: "ホーム", icon: "🏠", exact: true },
        { href: "/lpic1", label: "LPIC-1 対策コース", icon: "🐧" },
        { href: "/ccna", label: "CCNA 対策コース", icon: "🌐" },
        { href: "/ccna/simulation", label: "CCNA シミュレーション演習", icon: "🗺️" },
      ],
    },
    {
      title: "環境構築・実機ガイド",
      icon: "🖥️",
      items: [
        {
          href: "/lpic1/guide/linux-install",
          label: "Linux環境構築 (Ubuntu+VirtualBox)",
          icon: "💿",
        },
        { href: "/lpic1/guide", label: "環境構築ガイド一覧", icon: "📖" },
      ],
    },
    {
      title: "学習管理・ステータス",
      icon: "📊",
      items: [
        { href: "/dashboard", label: "進捗ダッシュボード", icon: "📈" },
        { href: "/quiz", label: "演習・問題確認", icon: "📝" },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ドロワーパネル（左側） */}
      <aside className="relative flex h-full w-[280px] sm:w-[320px] flex-col bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl transition-transform duration-300 transform translate-x-0 overflow-y-auto">
        {/* ヘッダー部（社内ポータル風メニュータイトル＆閉じるボタン） */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5 bg-[var(--surface-2)]">
          <div className="flex items-center gap-2 font-black text-sm text-[var(--foreground)] tracking-wide">
            <span className="text-base">📋</span>
            <span>メニュー</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors"
            title="閉じる"
            aria-label="メニューを閉じる"
          >
            ✕
          </button>
        </div>

        {/* ユーザーアカウント表示パネル */}
        <div className="border-b border-[var(--border)] p-4 bg-[var(--surface)]">
          {authStatus === "authenticated" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-primary)]/20 text-base font-bold text-[var(--accent-primary)]">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--foreground)] truncate">
                    {getDisplayName(user)}
                  </div>
                  <div className="text-[10px] text-[var(--accent-secondary)] font-medium">
                    ● 認証セッション有効
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {onOpenSystemModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSystemModal();
                    }}
                    className="flex-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] py-1.5 px-2 text-[11px] font-semibold text-[var(--accent-primary)] hover:bg-[var(--border)] transition-colors text-center"
                  >
                    ⏱️ セッション/システム確認
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="rounded-lg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.3)] py-1.5 px-2.5 text-[11px] font-semibold text-[#f85149] hover:bg-[rgba(248,81,73,0.2)] transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                ゲストログイン中
              </span>
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-lg bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>

        {/* ナビゲーション（カテゴリー別） */}
        <div className="flex-1 px-3 py-4 space-y-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-extrabold text-[var(--text-muted)] tracking-wider uppercase">
                <span>{group.icon}</span>
                <span>{group.title}</span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                        active
                          ? "bg-[var(--surface-2)] text-[var(--accent-primary)] font-bold shadow-sm"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* セッション・システム情報リンク */}
          {onOpenSystemModal && (
            <div className="pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSystemModal();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-[var(--accent-purple)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <span className="text-base shrink-0">🛡️</span>
                <span>セッション時間・権限確認</span>
              </button>
            </div>
          )}
        </div>

        {/* ドロワーフッター：テーマ切り替えなど */}
        <div className="border-t border-[var(--border)] p-4 bg-[var(--surface-2)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-medium">
            外観モード
          </span>
          <ThemeToggle />
        </div>
      </aside>
    </div>
  );
}
