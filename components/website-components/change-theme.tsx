"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
type ThemeToggleProps = {
  open?: boolean;
  variant?: "default" | "sidebar";
};

export function ThemeToggle({
  variant = "default",
  open = false,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-3 justify-start"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <button
        aria-label="Toggle theme"
        className={cn(
          "relative flex items-center justify-center transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",

          // ───────── DEFAULT (navbar / standalone)
          variant === "default" &&
            `
          h-9 w-9 rounded-lg
          border border-slate-300/60 dark:border-white/10
          bg-white/70 dark:bg-black/40
          backdrop-blur
          hover:bg-slate-100 dark:hover:bg-white/10
        `,

          // ───────── SIDEBAR (icon-only, subtle)
          variant === "sidebar" &&
            `
          h-9 w-9 rounded-md
          border border-sidebar-border
          bg-sidebar-accent
          hover:bg-sidebar-accent/80
        `
        )}
      >
        {/* Icon swap */}
        {isDark ? (
          <Sun
            className={cn(
              "h-4 w-4 transition",
              variant === "sidebar"
                ? "text-sidebar-foreground"
                : "text-amber-400"
            )}
          />
        ) : (
          <Moon
            className={cn(
              "h-4 w-4 transition",
              variant === "sidebar"
                ? "text-sidebar-foreground"
                : "text-amber-500"
            )}
          />
        )}
      </button>
      {variant === "sidebar" && open ? (isDark ? "Dark" : "Light") : null}
    </div>
  );
}
