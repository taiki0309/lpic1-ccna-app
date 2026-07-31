"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("certpath-theme") as Theme | null;
    if (stored && (stored === "dark" || stored === "light" || stored === "system")) {
      setThemeState(stored);
    } else {
      setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    let effective: "dark" | "light" = "dark";

    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effective = isDark ? "dark" : "light";
    } else {
      effective = theme;
    }

    setResolvedTheme(effective);
    root.setAttribute("data-theme", effective);
    root.classList.remove("dark", "light");
    root.classList.add(effective);
    localStorage.setItem("certpath-theme", theme);
  }, [theme, mounted]);

  // Handle system preference changes when in "system" mode
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      const effective = e.matches ? "dark" : "light";
      setResolvedTheme(effective);
      const root = document.documentElement;
      root.setAttribute("data-theme", effective);
      root.classList.remove("dark", "light");
      root.classList.add(effective);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
