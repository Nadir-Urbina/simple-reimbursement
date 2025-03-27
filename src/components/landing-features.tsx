"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CreditCard, Settings, Users, Clock, Shield, BarChart, Zap } from "lucide-react"

export function LandingFeatures() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: {},
    visible: {
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
    <section className="container mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Powerful Features</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to manage expenses efficiently and keep your finance team happy
        </p>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <FeatureCard
          icon={<FileText className="h-10 w-10 text-brand-purple" />}
          title="Simplified Submissions"
          description="Submit individual expenses or group them into comprehensive reports with just a few clicks."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<CreditCard className="h-10 w-10 text-brand-blue" />}
          title="Fast Reimbursements"
          description="Streamlined approval process ensures employees get reimbursed quickly and efficiently."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<Settings className="h-10 w-10 text-brand-teal" />}
          title="Customizable Policies"
          description="Configure auto-approval thresholds and minimum expense amounts to match your company policies."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-brand-green" />}
          title="Manager Approvals"
          description="Request manager verification for expenses that require additional oversight."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<Clock className="h-10 w-10 text-brand-yellow" />}
          title="Real-time Tracking"
          description="Monitor the status of expense reports throughout the approval process."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<Shield className="h-10 w-10 text-brand-orange" />}
          title="Secure Storage"
          description="All receipts and sensitive information are stored securely in compliance with data protection standards."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<BarChart className="h-10 w-10 text-brand-red" />}
          title="Advanced Analytics"
          description="Gain insights into spending patterns and identify opportunities for cost savings."
          variants={itemVariants}
        />
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-brand-purple" />}
          title="Automated Processing"
          description="Reduce manual work with intelligent automation and smart expense categorization."
          variants={itemVariants}
        />
      </motion.div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  variants: any
}

function FeatureCard({ icon, title, description, variants }: FeatureCardProps) {
  return (
    <motion.div variants={variants}>
      <Card className="h-full card-hover border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="mb-4">{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

