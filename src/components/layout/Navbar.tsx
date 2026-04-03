"use client";

import { ThemeToggle } from "@/components/common/ThemeToggle";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      {/* Mobile Logo */}
      <div className="flex md:hidden items-center gap-3">
        <div className="w-8 h-8 rounded-[9999px] bg-[#191c1f] dark:bg-white flex items-center justify-center">
          <span className="text-white dark:text-[#191c1f] text-sm font-medium leading-none">Z</span>
        </div>
        <span className="heading-card text-lg">Zorvyn</span>
      </div>

      {/* Desktop spacer */}
      <div className="hidden md:flex flex-col">
        <div className="h-6" />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 ml-auto">
        <RoleSwitcher />
        <div className="w-px h-6 bg-[var(--border)]" />
        <ThemeToggle />
        <div className="w-9 h-9 rounded-full bg-[var(--surface-alt)] flex items-center justify-center overflow-hidden border border-[var(--border)] cursor-pointer hover:border-[var(--muted)] transition-colors">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
