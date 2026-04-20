"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  BookMarked,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";
import { MASTER_BOOK_SLUG } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: `/reader/${MASTER_BOOK_SLUG}/1`, icon: BookMarked, label: "Start Reading" },
  { href: "/dashboard/progress", icon: BarChart2, label: "My Progress" },
  { href: "/dashboard/learn", icon: GraduationCap, label: "Labs & Quizzes" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  isAdmin?: boolean;
  isMobileOpen?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ isAdmin, isMobileOpen, collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  const items = [...NAV_ITEMS];
  if (isAdmin) {
    items.push({ href: "/admin", icon: ShieldAlert, label: "Admin Panel" });
  }

  return (
    <aside className={cn("sidebar", collapsed && "sidebar-collapsed", isMobileOpen && "sidebar-mobile-open")}>
      {/* Logo */}
      <Link href="/" className="sidebar-logo group cursor-pointer border-b border-zinc-100 dark:border-zinc-800/50 mb-2">
        <div className="sidebar-logo-icon group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-indigo-600/20">
          <BookOpen size={22} />
        </div>
        {!collapsed && (
          <span className="sidebar-logo-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Nexus Ai
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn("sidebar-link", active && "sidebar-link-active")}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="sidebar-link-icon" />
              {!collapsed && (
                <span className="sidebar-link-label">{label}</span>
              )}
              {active && <span className="sidebar-link-dot" />}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => onCollapse?.(!collapsed)}
        className="sidebar-collapse-btn"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        id="sidebar-collapse-toggle"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
