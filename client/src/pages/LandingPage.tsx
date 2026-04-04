import PromoStrip from '../components/PromoStrip'
import Hero from '../components/Hero'
import EventsSection from '../components/EventsSection'

export default function LandingPage() {
  return (
    <div>
      <PromoStrip />
      <Hero />
      <EventsSection />
      <footer className="footer-strip">© Black Star Lounge · All rights reserved</footer>
    </div>
  )
}
