import Navbar from "@/components/Navbar";
import Hero from "@/components/HomePageComponents/Hero";
import Brands from "@/components/HomePageComponents/Brands";
import Testimonials from "@/components/HomePageComponents/Testimonials";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/HomePageComponents/ServicesSection";
import Products from "@/components/HomePageComponents/Products";
import ContactHero from "@/components/ContactComponents/ContactHero";
import ContactInfo from "@/components/ContactComponents/ContactInfo";
import ContactForm from "@/components/ContactComponents/ContactForm";
import ContactMap from "@/components/ContactComponents/ContactMap";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-800">
      <Navbar />
      <Hero />
      <Brands />
      <Testimonials />
      <Footer />
    </main>
  );
}
