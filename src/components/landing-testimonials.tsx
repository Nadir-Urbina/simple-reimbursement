"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function LandingTestimonials() {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CFO, TechCorp",
      content:
        "SimpleReimbursement has transformed how we handle expenses. Our finance team saves hours each week, and employees get reimbursed faster than ever.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Operations Director, GrowthCo",
      content:
        "The automated approval workflows and policy enforcement have reduced our expense processing errors by 90%. I can't imagine going back to our old system.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager, StartupX",
      content:
        "Our employees love how easy it is to submit expenses on the go. The mobile app is intuitive, and the receipt scanning feature is a game-changer.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ER",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Trusted by thousands of companies worldwide</p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full card-hover">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-brand-yellow text-brand-yellow" />
                    ))}
                  </div>
                  <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="py-2">
                <img
                  src={`/placeholder.svg?height=30&width=120&text=COMPANY+${i + 1}`}
                  alt={`Company ${i + 1}`}
                  className="h-8 md:h-10"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

