"use client"

import type React from "react"

import { AuthProvider as Auth } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Auth>{children}</Auth>
}

