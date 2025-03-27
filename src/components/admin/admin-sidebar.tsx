"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, FileText, Home, CreditCard, Settings, Users, Clock, Sliders } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Approvals",
      icon: CreditCard,
      href: "/admin/approvals",
      active: pathname === "/admin/approvals" || pathname.startsWith("/admin/approvals/"),
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/admin/reports",
      active: pathname === "/admin/reports" || pathname.startsWith("/admin/reports/"),
    },
    {
      label: "History",
      icon: Clock,
      href: "/admin/history",
      active: pathname === "/admin/history",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      label: "Employees",
      icon: Users,
      href: "/admin/employees",
      active: pathname === "/admin/employees",
    },
    {
      label: "Policies",
      icon: Sliders,
      href: "/admin/policies",
      active: pathname === "/admin/policies",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <ScrollArea className="h-[calc(100vh-4rem)] w-64">
        <div className="flex flex-col gap-2 p-4">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn("justify-start", route.active ? "bg-secondary" : "hover:bg-muted")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

