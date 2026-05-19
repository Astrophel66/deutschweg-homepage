import Hero from "../sections/Hero.jsx"
import Stats from "../sections/Stats.jsx"
import Features from "../sections/Features.jsx"
import HowItWorks from "../sections/HowItWorks.jsx"
import Teachers from "../sections/Teachers.jsx"
import Courses from "../sections/Courses.jsx"
import Resources from "../sections/Resources.jsx"
import Testimonials from "../sections/Testimonials.jsx"
import CTA from "../sections/CTA.jsx"

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Teachers />
      <Courses />
      <Resources />
      <Testimonials />
      <CTA />
    </main>
  )
}