import RegisterForm from '@/components/RegisterComponents/RegisterForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1  pb-15">
        <RegisterForm />
      </div>

      <Footer />
    </main>
  )
}
