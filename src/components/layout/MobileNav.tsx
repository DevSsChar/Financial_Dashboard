"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, PieChart, Shield, Settings } from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "@/context/AppContext";

const navItems = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Activity", href: "/transactions", icon: ArrowLeftRight },
  { name: "Insights", href: "/insights", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const { state } = useAppContext();

  const items =
    state.role === "admin"
      ? [
          ...navItems.slice(0, 3),
          { name: "Admin", href: "/admin", icon: Shield },
          ...navItems.slice(3),
        ]
      : navItems;

  return (
    <div className="md:hidden fixed bottom-5 left-4 right-4 z-40">
      {/* Design.md §6: Zero shadows — using border + backdrop-blur instead */}
      <nav className="flex items-center justify-around bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border)] p-2 rounded-[20px]">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const isAdminItem = item.name === "Admin";
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full py-2 rounded-[12px] transition-all",
                isActive
                  ? isAdminItem
                    ? "text-[#e23b4a]"
                    : "text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              )}
            >
              <div
                className={clsx(
                  "p-1.5 rounded-full mb-1 transition-colors",
                  isActive && isAdminItem
                    ? "bg-[#e23b4a]/10"
                    : isActive
                    ? "bg-[var(--surface-alt)]"
                    : "bg-transparent"
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
