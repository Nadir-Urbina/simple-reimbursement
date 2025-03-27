"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function FaqsPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            "Creating an account is simple. Click on the 'Get Started' button on our homepage, fill in your details, and follow the prompts to set up your company profile. You'll be up and running in minutes.",
        },
        {
          question: "Is there a free trial available?",
          answer:
            "Yes, we offer a 14-day free trial on all our plans. No credit card is required to get started, and you'll have access to all features of your selected plan during the trial period.",
        },
        {
          question: "How many users can I add to my account?",
          answer:
            "The number of users depends on your plan. Our Starter plan supports up to 10 users, Professional up to 50 users, and Enterprise offers unlimited users. You can upgrade your plan at any time if you need to add more users.",
        },
        {
          question: "Can I import data from another expense system?",
          answer:
            "Yes, we provide tools to import your existing expense data from most popular expense management systems. Our support team can assist you with the migration process to ensure a smooth transition.",
        },
      ],
    },
    {
      title: "Using the Platform",
      faqs: [
        {
          question: "How do employees submit expenses?",
          answer:
            "Employees can submit expenses through our web application or mobile app. They simply fill out the expense details, attach a receipt (by taking a photo or uploading a file), and submit it for approval. The system will automatically route it according to your company's approval workflow.",
        },
        {
          question: "Can I customize approval workflows?",
          answer:
            "Yes, you can create custom approval workflows based on expense amount, category, department, or other criteria. This allows you to match your company's specific policies and organizational structure.",
        },
        {
          question: "How does receipt scanning work?",
          answer:
            "Our receipt scanning feature uses OCR (Optical Character Recognition) technology to extract key information from receipts, including vendor, date, amount, and tax. This data is automatically populated in the expense form, saving time and reducing manual entry errors.",
        },
        {
          question: "Can managers approve expenses on mobile?",
          answer:
            "Yes, managers can review and approve expenses on both our web application and mobile app. They'll receive notifications when expenses require their approval and can quickly approve or reject them on the go.",
        },
      ],
    },
    {
      title: "Billing & Subscriptions",
      faqs: [
        {
          question: "How does billing work?",
          answer:
            "We offer both monthly and annual billing options. Annual subscriptions come with a 20% discount compared to monthly billing. You'll be billed automatically at the start of each billing period.",
        },
        {
          question: "Can I change my plan?",
          answer:
            "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, with prorated charges for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, including Visa, Mastercard, and American Express. Enterprise customers also have the option to pay by invoice.",
        },
        {
          question: "Is there a setup fee?",
          answer:
            "No, we don't charge any setup fees. You only pay the advertised subscription price for your chosen plan.",
        },
      ],
    },
    {
      title: "Security & Compliance",
      faqs: [
        {
          question: "How secure is my data?",
          answer:
            "We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices, including regular security audits, penetration testing, and follow SOC 2 compliance standards.",
        },
        {
          question: "Do you comply with GDPR?",
          answer:
            "Yes, we are fully GDPR compliant. We provide tools and processes to help you meet your GDPR obligations, including data export and deletion capabilities.",
        },
        {
          question: "Where is my data stored?",
          answer:
            "Your data is stored in secure, enterprise-grade data centers. We offer regional data storage options for customers who need to keep their data in specific geographic regions for compliance reasons.",
        },
        {
          question: "Can I export my data?",
          answer:
            "Yes, you can export your data at any time in various formats, including CSV and PDF. This ensures you always have access to your information and can meet record-keeping requirements.",
        },
      ],
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    : faqCategories

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find answers to common questions about SimpleReimbursement
          </p>

          <div className="max-w-xl mx-auto relative mb-12">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No results found for "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            filteredFaqs.map((category, index) => (
              <motion.div key={index} variants={itemVariants} className="mb-10">
                <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                <Accordion type="single" collapsible className="border rounded-lg">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                      <AccordionTrigger className="px-4 hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-medium mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild>
              <Link href="/documentation">Browse Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

