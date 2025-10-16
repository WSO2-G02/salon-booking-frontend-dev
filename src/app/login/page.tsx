import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginComponents/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 pb-15">
        <LoginForm />
      </div>

      <Footer />
    </main>
  )
}
