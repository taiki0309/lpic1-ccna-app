"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options: { id: "light" | "dark" | "system"; label: string; icon: string }[] = [
    { id: "light", label: "ライト", icon: "☀️" },
    { id: "dark", label: "ダーク", icon: "🌙" },
    { id: "system", label: "自動", icon: "💻" },
  ];

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
