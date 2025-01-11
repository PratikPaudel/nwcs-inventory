"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export default function Navbar(): React.ReactElement {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Inventory", href: "/inventory", icon: "📦" },
    { label: "Users", href: "/users", icon: "👥" },
    { label: "Reporting", href: "/reporting", icon: "📈" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <nav className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r z-20">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
