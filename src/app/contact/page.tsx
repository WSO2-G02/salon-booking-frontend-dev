'use client'

import ContactHero from '@/components/ContactComponents/ContactHero'
import ContactInfo from '@/components/ContactComponents/ContactInfo'
import ContactForm from '@/components/ContactComponents/ContactForm'
import ContactMap from '@/components/ContactComponents/ContactMap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <main className="text-gray-800">
      <Navbar  />
      <ContactHero />

      <section className="py-16 px-6 md:px-16 grid md:grid-cols-2 gap-12">
        <ContactInfo />
        <ContactForm />
      </section>

      <ContactMap />
      <Footer/>
    </main>
  )
}
