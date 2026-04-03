"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Settings, PieChart, Shield } from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "@/context/AppContext";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Insights", href: "/insights", icon: PieChart },
];

const adminItems = [
  { name: "Admin (CRUD)", href: "/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useAppContext();

  return (
    <aside className="hidden md:flex flex-col w-64 h-full border-r border-[var(--border)] bg-[var(--surface)] p-5 font-sans">
      {/* Logo — Design.md: pill-shaped badge */}
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="w-9 h-9 rounded-[9999px] bg-[#191c1f] dark:bg-white flex items-center justify-center">
          <span className="text-white dark:text-[#191c1f] text-base font-medium leading-none">Z</span>
        </div>
        <span className="heading-card text-xl">Zorvyn</span>
      </div>

      {/* Navigation — Design.md: 9999px radius, weight 500 for nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-[9999px] transition-all duration-200 group text-[14px]",
                isActive
                  ? "bg-[var(--surface-alt)] font-medium"
                  : "text-[var(--muted)] font-normal hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon
                className={clsx(
                  "w-[18px] h-[18px]",
                  isActive ? "" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                )}
              />
              {item.name}
            </Link>
          );
        })}

        {/* Admin section */}
        {state.role === "admin" && (
          <div className="pt-6 mt-6 border-t border-[var(--border)]">
            <h4 className="px-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] mb-2">
              Admin
            </h4>
            {adminItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2.5 rounded-[9999px] transition-all duration-200 group text-[14px]",
                    isActive
                      ? "bg-[#e23b4a]/8 text-[#e23b4a] font-medium"
                      : "text-[var(--muted)] font-normal hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)]"
                  )}
                >
                  <item.icon
                    className={clsx(
                      "w-[18px] h-[18px]",
                      isActive ? "text-[#e23b4a]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Settings — pinned bottom */}
      <div className="mt-auto px-1 pb-2">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-[9999px] transition-all duration-200 group",
            pathname === "/settings"
              ? "bg-[var(--surface-alt)] font-medium"
              : "text-[var(--muted)] font-normal hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
          )}
        >
          <Settings className="w-[18px] h-[18px] text-[var(--muted)] group-hover:text-[var(--foreground)]" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
