"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart,
  Clock,
  FileText,
  Home,
  Settings,
  User,
  Users,
  DollarSign,
} from "lucide-react";

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Base navigation items for all users
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Expenses",
      href: "/dashboard/expenses",
      icon: FileText,
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart,
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: Clock,
    },
  ];
  
  // Admin-specific items
  const adminItems = [
    {
      name: "Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      name: "Approvals",
      href: "/dashboard/approvals",
      icon: DollarSign,
    },
  ];
  
  // Add admin items if user is an admin
  const allItems = user?.role === "org_admin" || user?.role === "approver"
    ? [...navItems, ...adminItems]
    : navItems;
  
  // Always add settings at the end
  allItems.push({
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  });

  return (
    <nav className={cn("grid items-start gap-2 px-2", className)}>
      {allItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-accent text-accent-foreground"
                : "transparent"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
} 