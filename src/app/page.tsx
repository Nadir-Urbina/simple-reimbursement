import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingTestimonials } from "@/components/landing-testimonials"
import { LandingCta } from "@/components/landing-cta"
import { LandingStats } from "@/components/landing-stats"

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingCta />
    </main>
  )
}

