import AboutHero from "@/components/AboutComponents/AboutHero"
import AboutJourney from "@/components/AboutComponents/AboutJourney"
import AboutFounder from "@/components/AboutComponents/AboutFounder"
import AboutVisionMission from "@/components/AboutComponents/AboutVisionMission"
import Footer from "@/components/Footer"
import Nav from "@/components/Navbar"
import Products from "@/components/HomePageComponents/Products"
import Services from "@/components/HomePageComponents/ServicesSection"

export default function AboutPage() {
  return (
    <>
      <Nav/>
      <Products />
      <Services />
      <Footer />
    </>
  )
}
