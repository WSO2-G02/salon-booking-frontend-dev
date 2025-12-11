import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import image1 from "../../images/inside.jpg";
import image2 from "../../images/chair.webp";
import image3 from "../../images/mirror.jpg";

export const metadata = {
  title: "Terms & Conditions | AURORA Salon",
  description:
    "Official Terms & Conditions for AURORA Salon. Learn about our booking rules, cancellation policy, pricing guidelines, and service commitments.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#faf9f6] text-gray-900">
      {/* HEADER */}
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={image2}
          alt="AURORA Salon Interior"
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-wide drop-shadow-2xl">
              Terms & Conditions
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-[#f6e27f] mx-auto mt-4 rounded-full" />
          </div>
        </div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">

        {/* INTRO */}
        <section className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-semibold mb-3">Welcome to AURORA</h2>
          <div className="w-20 h-[3px] bg-[#d4af37] mx-auto mb-4 rounded-full" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            At <span className="font-semibold text-black">AURORA Salon</span>, we are committed to delivering 
            exceptional beauty and wellness experiences. Please read these terms carefully to ensure a 
            seamless, luxurious journey every time you visit.
          </p>
        </section>

        {/* CONTENT BOX */}
        <div className="bg-white shadow-2xl rounded-3xl p-10 md:p-12 space-y-16 border border-gray-100 animate-slideUp">

          {/* SECTION TEMPLATE */}
          {/* SECTION 1 */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">1. Appointment Policy</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full" />
            <p className="text-gray-700">
              To maintain a premium service experience:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-700">
              <li>Arrive 10 minutes before your scheduled appointment.</li>
              <li>Late arrivals may result in shorter service times.</li>
              <li>Walk-in services are subject to availability.</li>
            </ul>
          </div>

          {/* IMAGE */}
          <div className="rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition">
            <Image src={image1} alt="Luxury Interior" className="object-cover w-full h-64" />
          </div>

          {/* SECTION 2 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">2. Cancellation Policy</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <p className="text-gray-700">
              We kindly request:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-700">
              <li>Cancellations must be made at least 6 hours before appointment time.</li>
              <li>No-shows may require prepayment for future bookings.</li>
              <li>Frequent cancellations may affect appointment eligibility.</li>
            </ul>
          </div>

          {/* TWO-COLUMN SECTION */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">3. Pricing & Payments</h3>
              <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>Prices may change without notice.</li>
                <li>Additional charges apply for extra product usage.</li>
                <li>We accept cash, card, and digital payments.</li>
              </ul>
            </div>

            <div className="rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition h-56 relative">
              <Image src={image3} alt="Salon Service" fill className="object-cover" />
            </div>
          </div>

          {/* SECTION 4 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">4. Satisfaction Guarantee</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <p className="text-gray-700">
              Your satisfaction matters to us:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-2 text-gray-700">
              <li>Notify us immediately or within 24 hours for adjustments.</li>
              <li>Corrections are complimentary within the original service scope.</li>
              <li>Refunds are not provided for completed services.</li>
            </ul>
          </div>

          {/* SECTION 5 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">5. Health & Safety</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Please inform us of allergies or sensitivities.</li>
              <li>We may decline a service if health risk exists.</li>
              <li>Children must remain supervised at all times.</li>
            </ul>
          </div>

          {/* SECTION 6 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">6. Colouring & Treatment Disclaimer</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <p className="text-gray-700">
              Results vary depending on hair history, texture, and condition. Patch tests may be required.
            </p>
          </div>

          {/* SECTION 7 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">7. Gift Cards & Promotions</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Gift cards are non-refundable.</li>
              <li>Promotions cannot be combined unless stated.</li>
              <li>Terms may be updated at any time.</li>
            </ul>
          </div>

          {/* SECTION 8 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">8. Privacy Commitment</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <p className="text-gray-700">
              Your personal data is used only for bookings and salon communication. We never share your information.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
            <div className="w-16 h-[3px] bg-[#d4af37] rounded-full mb-3" />
            <p className="text-gray-700 leading-relaxed">
              📍 No.6, Pagoda Road, Nugegoda <br />
              📞 +94 77 388 5122 <br />
              📧 aurorasalon@gmail.com
            </p>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-12 text-center animate-fadeIn">
          <a
            href="/"
            className="bg-gradient-to-r from-black to-gray-800 text-white px-10 py-3 rounded-lg text-lg shadow-lg hover:from-red-600 hover:to-red-500 transition"
          >
            Back to Home
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
