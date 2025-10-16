'use client'

import { useState } from 'react'
import InputField from '../RegisterComponents/InputField'
import SubmitButton from '../RegisterComponents/SubmitButton'
import { loginUser } from '@/services/userService'
import Link from 'next/link'

export default function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' })
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
      const res = await loginUser(form)
      setMessage(`✅ Welcome back, ${res.user?.username || 'User'}!`)
      localStorage.setItem('access_token', res.access_token)
      setTimeout(() => (window.location.href = '/profile'), 1000) // redirect
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
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

      <InputField
        label="Username or Email"
        name="username"
        value={form.username}
        onChange={handleChange}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <SubmitButton text="Login" loading={loading} />

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
        Don’t have an account?{' '}
        <Link href="/register" className="text-red-500 hover:underline font-semibold">
          Register
        </Link>
      </p>
    </form>
  )
}
