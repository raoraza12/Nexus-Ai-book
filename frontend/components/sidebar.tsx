"use client";

import { useState } from "react";
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
  { href: "/", icon: Home, label: "Home" },
  { href: `/reader/${MASTER_BOOK_SLUG}/1`, icon: BookMarked, label: "Start Reading" },
  { href: "/dashboard/progress", icon: BarChart2, label: "My Progress" },
  { href: "/dashboard/ai-chat", icon: MessageSquare, label: "Ask AI Agent" },
  { href: "/dashboard/learn", icon: GraduationCap, label: "Labs & Quizzes" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  isAdmin?: boolean;
  isMobileOpen?: boolean;
}

export function Sidebar({ isAdmin, isMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const items = [...NAV_ITEMS];
  if (isAdmin) {
    items.push({ href: "/admin", icon: ShieldAlert, label: "Admin Panel" });
  }

  return (
    <aside className={cn("sidebar", collapsed && "sidebar-collapsed", isMobileOpen && "sidebar-mobile-open")}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BookOpen size={22} />
        </div>
        {!collapsed && <span className="sidebar-logo-text">Nexus Ai</span>}
      </div>

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
        onClick={() => setCollapsed(!collapsed)}
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
