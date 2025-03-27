"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  heading: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function DashboardHeader({
  heading,
  description,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between py-6", className)}>
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
} 