import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePageComponents/Hero'
import Brands from '@/components/HomePageComponents/Brands'
import Testimonials from '@/components/HomePageComponents/Testimonials'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="bg-white text-gray-800">
      <Navbar />
      <Hero />
      <Brands />
      <Testimonials />
      <Footer />
    </main>
  )
}
