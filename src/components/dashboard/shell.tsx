"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Notifications } from "@/components/dashboard/notifications";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <a href="/" className="hidden md:block">
              <div className="font-bold text-lg text-primary">SimpleReimbursement</div>
            </a>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden md:flex"
            >
              <Menu className="h-4 w-4 mr-2" />
              <span className="sr-only md:not-sr-only md:inline-block">
                {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        <aside
          className={cn(
            "fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block",
            showSidebar ? "md:block" : "md:hidden",
            showMobileSidebar ? "block" : "hidden",
          )}
        >
          <DashboardNav className="py-6" />
        </aside>
        <main className={cn("flex w-full flex-col overflow-hidden", className)}>
          {children}
        </main>
      </div>
    </div>
  );
} 