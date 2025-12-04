import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AppointmentWizard from '@/components/BookNowComponents/AppointmentWizard'

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-1">
        <h1 className="text-center text-2xl text-black font-bold mb-2">
          Select Your Appointment
        </h1>

        <p className="text-center text-gray-700 font-semibold mb-8">
          Choose your desired service, pick a time, and confirm your booking.
        </p>

        <AppointmentWizard />
      </div>

      <Footer />
    </main>
  )
}
