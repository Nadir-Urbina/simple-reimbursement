"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function LandingHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">Simplify Your Expense Management</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Streamline your company's expense process with our intuitive platform. Save time, reduce errors, and gain
            insights.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button asChild size="lg" className="gradient-bg text-white hover:opacity-90">
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gradient-border">
              <Link href="/contact">Request Demo</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm"
          >
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-brand-green" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-brand-green" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-brand-green" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-5xl rounded-xl overflow-hidden shadow-2xl border">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 backdrop-blur-[1px]" />
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="SimpleReimbursement Dashboard"
              className="w-full h-auto relative z-10"
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-brand-yellow/30 animate-bounce-light" />
          <div className="absolute top-1/4 -right-6 w-24 h-24 rounded-full bg-brand-teal/20 animate-spin-slow" />
        </motion.div>
      </div>
    </section>
  )
}

