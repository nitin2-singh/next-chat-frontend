"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageSquare } from "lucide-react";
import { ThemeToggle } from "./change-theme";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="
        fixed top-0 z-50 w-full
        backdrop-blur-xl
        bg-white/70 dark:bg-black/60
        border-b border-slate-200/60 dark:border-white/10
      "
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="
            flex items-center gap-2 font-semibold tracking-tight
            text-slate-900 dark:text-white
          "
        >
          <MessageSquare className="h-5 w-5 text-amber-400" />
          ChatScale
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          {/* Auth + theme */}
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200/60 dark:border-white/10">
            <ThemeToggle />

            <Link
              href="/login"
              className="
                transition
                text-slate-600 hover:text-slate-900
                dark:text-slate-400 dark:hover:text-white
              "
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="
                px-4 py-2 rounded-lg
                bg-amber-500 hover:bg-amber-600
                text-black font-medium transition
              "
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="
            md:hidden transition
            text-slate-700 hover:text-slate-900
            dark:text-slate-300 dark:hover:text-white
          "
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              md:hidden
              bg-white/95 dark:bg-black/90
              backdrop-blur-xl
              border-t border-slate-200/60 dark:border-white/10
            "
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.href}
                  {...link}
                  onClick={() => setOpen(false)}
                />
              ))}

              {/* Mobile auth */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-4">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>

                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="
                    text-center transition
                    text-slate-700 hover:text-slate-900
                    dark:text-slate-300 dark:hover:text-white
                  "
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="
                    text-center px-4 py-3 rounded-lg
                    bg-amber-500 hover:bg-amber-600
                    text-black font-medium transition
                  "
                >
                  Sign up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ---------------- Components ---------------- */

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="
        relative group transition
        text-slate-600 hover:text-slate-900
        dark:text-slate-400 dark:hover:text-white
      "
    >
      {label}
      <span
        className="
          absolute left-0 -bottom-1 h-px w-0
          bg-amber-400 transition-all
          group-hover:w-full
        "
      />
    </Link>
  );
}

function MobileNavLink({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        text-lg font-medium transition
        text-slate-700 hover:text-amber-500
        dark:text-slate-200 dark:hover:text-amber-400
      "
    >
      {label}
    </Link>
  );
}
