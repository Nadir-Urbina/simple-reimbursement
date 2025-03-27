"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams just getting started",
      price: isAnnual ? 29 : 39,
      features: ["Up to 10 users", "Basic expense tracking", "Receipt scanning", "Export to CSV", "Email support"],
      popular: false,
      cta: "Start Free Trial",
      ctaLink: "/register?plan=starter",
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with more needs",
      price: isAnnual ? 79 : 99,
      features: [
        "Up to 50 users",
        "Advanced expense policies",
        "Approval workflows",
        "Basic integrations",
        "Analytics dashboard",
        "Priority support",
      ],
      popular: true,
      cta: "Start Free Trial",
      ctaLink: "/register?plan=professional",
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex requirements",
      price: isAnnual ? 199 : 249,
      features: [
        "Unlimited users",
        "Custom approval flows",
        "Advanced analytics",
        "API access",
        "SSO integration",
        "Dedicated account manager",
        "Custom integrations",
      ],
      popular: false,
      cta: "Contact Sales",
      ctaLink: "/contact?plan=enterprise",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that works best for your business
          </p>

          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? "text-muted-foreground" : ""}>
              Monthly
            </Label>
            <div className="flex items-center">
              <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className="ml-2 text-sm bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full">Save 20%</span>
            </div>
            <Label htmlFor="billing-toggle" className={isAnnual ? "text-muted-foreground" : ""}>
              Annual
            </Label>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`pricing-card h-full flex flex-col ${plan.popular ? "popular border-brand-purple shadow-lg" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {isAnnual ? "year" : "month"}</span>
                    {isAnnual && <p className="text-sm text-muted-foreground mt-1">Billed annually</p>}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? "gradient-bg text-white hover:opacity-90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer a 14-day free trial on all plans. No credit card required to get started.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, including Visa, Mastercard, and American Express. Enterprise
                  customers can also pay by invoice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No, there are no setup fees for any of our plans. You only pay the advertised subscription price.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Have more questions? We're here to help.</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Our Sales Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

