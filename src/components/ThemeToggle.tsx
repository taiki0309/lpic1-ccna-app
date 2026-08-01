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

  const options: { id: "light" | "dark"; label: string; icon: string }[] = [
    { id: "light", label: "ライト", icon: "☀️" },
    { id: "dark", label: "ダーク", icon: "🌙" },
  ];

  const currentTheme = theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  const currentOpt = options.find((o) => o.id === currentTheme) || options[0];
  const nextOpt = options.find((o) => o.id === nextTheme) || options[1];

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        title={`外観切替: 現在[${currentOpt.label}] → 点击で[${nextOpt.label}]に変更`}
        aria-label={`テーマ切り替え（現在: ${currentOpt.label}）`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)] transition-all hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
      >
        {currentOpt.icon}
      </button>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        title={`外観切替: ${currentOpt.label} → ${nextOpt.label}`}
        aria-label={`テーマ切り替え（現在: ${currentOpt.label}）`}
        className="flex flex-col items-center gap-0.5 w-full rounded-xl px-2 py-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-all duration-200"
        style={{ fontSize: "0.6rem", fontWeight: 600 }}
      >
        <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>{currentOpt.icon}</span>
        <span>{currentOpt.label}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="外観選択"
      className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-inner"
    >
      {options.map((opt) => {
        const isActive = currentTheme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            aria-pressed={isActive}
            className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              isActive
                ? "bg-[var(--accent-primary)] text-white shadow-md scale-105 font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]"
            }`}
            title={`${opt.label}モードに切り替え`}
          >
            <span className="text-sm">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
