"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function LandingStats() {
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
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-4xl md:text-5xl font-bold gradient-text">98%</p>
            <p className="text-muted-foreground">Customer Satisfaction</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-4xl md:text-5xl font-bold gradient-text">75%</p>
            <p className="text-muted-foreground">Time Saved</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-4xl md:text-5xl font-bold gradient-text">5000+</p>
            <p className="text-muted-foreground">Companies</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-4xl md:text-5xl font-bold gradient-text">$2M+</p>
            <p className="text-muted-foreground">Processed Daily</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

