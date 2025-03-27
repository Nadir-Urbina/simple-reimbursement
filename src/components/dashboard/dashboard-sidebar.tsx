"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, FileText, Home, CreditCard, Settings, Users, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Expenses",
      icon: CreditCard,
      href: "/dashboard/expenses",
      active: pathname === "/dashboard/expenses" || pathname.startsWith("/dashboard/expenses/"),
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/dashboard/reports",
      active: pathname === "/dashboard/reports" || pathname.startsWith("/dashboard/reports/"),
    },
    {
      label: "History",
      icon: Clock,
      href: "/dashboard/history",
      active: pathname === "/dashboard/history",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      label: "Team",
      icon: Users,
      href: "/dashboard/team",
      active: pathname === "/dashboard/team",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <ScrollArea className="h-[calc(100vh-4rem)] w-64">
        <div className="flex flex-col gap-2 p-4">
          {routes.map((route, index) => (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Button
                variant={route.active ? "secondary" : "ghost"}
                className={cn("justify-start w-full", route.active ? "bg-secondary" : "hover:bg-muted")}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

