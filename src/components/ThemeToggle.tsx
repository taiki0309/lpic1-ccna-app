"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({
  compact = false,
  iconOnly = false,
}: {
  compact?: boolean;
  iconOnly?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  const options: { id: "light" | "dark" | "system"; label: string; icon: string }[] = [
    { id: "light", label: "ライト", icon: "☀️" },
    { id: "dark", label: "ダーク", icon: "🌙" },
    { id: "system", label: "自動", icon: "💻" },
  ];

  if (iconOnly) {
    const currentIndex = options.findIndex((o) => o.id === theme);
    const next = options[(currentIndex + 1) % options.length];
    const current = options[currentIndex] ?? options[0];
    return (
      <button
        type="button"
        onClick={() => setTheme(next.id)}
        title={`テーマ: ${current.label} → ${next.label}に切替`}
        aria-label={`テーマ切り替え（現在: ${current.label}）`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)] transition-all hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
      >
        {current.icon}
      </button>
    );
  }

  if (compact) {
    // Sidebar mode: cycle through themes on click
    const currentIndex = options.findIndex((o) => o.id === theme);
    const next = options[(currentIndex + 1) % options.length];
    const current = options[currentIndex] ?? options[0];
    return (
      <button
        type="button"
        onClick={() => setTheme(next.id)}
        title={`テーマ: ${current.label} → ${next.label}に切替`}
        aria-label={`テーマ切り替え（現在: ${current.label}）`}
        className="flex flex-col items-center gap-0.5 w-full rounded-xl px-2 py-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-all duration-200"
        style={{ fontSize: "0.6rem", fontWeight: 600 }}
      >
        <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>{current.icon}</span>
        <span>テーマ</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="テーマ選択"
      className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-inner"
    >
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            aria-pressed={isActive}
            className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              isActive
                ? "bg-[var(--accent-primary)] text-white shadow-md scale-105"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]"
            }`}
            title={`${opt.label}モードに切り替え`}
          >
            <span className="text-sm">{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

