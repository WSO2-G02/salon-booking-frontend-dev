'use client'

import { useState } from 'react'
import InputField from './InputField'
import SubmitButton from './SubmitButton'
import { registerUser } from '@/services/userService'
import Link from 'next/link'

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await registerUser(form)
      setMessage(`✅ Registered successfully! Welcome, ${res.username || res.full_name}`)
      setForm({ email: '', username: '', password: '', full_name: '', phone: '' })
      setTimeout(() => (window.location.href = '/login'), 1000)
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>

      <InputField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
      <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <InputField label="Username" name="username" value={form.username} onChange={handleChange} />
      <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
      <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

      <SubmitButton text="Register" loading={loading} />

      {message && (
        <p
          className={`text-center mt-4 ${
            message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-red-500 hover:underline font-semibold">
          Login
        </Link>
      </p>
    </form>
  )
}
