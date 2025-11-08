'use client'

import { useState } from 'react'
import InputField from '@/components/RegisterComponents/InputField'
import SubmitButton from '@/components/RegisterComponents/SubmitButton'
import { loginUser } from '@/services/userService'
import { showToast } from '@/components/Toast'
import Link from 'next/link'

type LoginType = 'user' | 'admin'

export default function LoginForm() {
  const [loginType, setLoginType] = useState<LoginType>('user')
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser(form)
      showToast(`Welcome back, ${res.user?.username || 'User'}!`, 'success')
      localStorage.setItem('access_token', res.access_token)
      setTimeout(() => (window.location.href = '/profile'), 1500)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (form.username === 'admin' && form.password === 'admin123') {
        showToast('Admin login successful! Redirecting...', 'success')
        localStorage.setItem('admin_token', 'mock_admin_token')
        localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', role: 'admin' }))
        setTimeout(() => (window.location.href = '/admin/dashboard'), 1500)
      } else {
        throw new Error('Invalid admin credentials')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = loginType === 'user' ? handleUserLogin : handleAdminLogin

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10 border border-gray-200"
    >
      {/* Login Type Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => {
            setLoginType('user')
            setForm({ username: '', password: '' })
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            loginType === 'user'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          User Login
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginType('admin')
            setForm({ username: '', password: '' })
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            loginType === 'admin'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Admin Login
        </button>
      </div>

      {/* Header */}
      {loginType === 'user' ? (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
          <p className="text-sm text-gray-500 mt-2">Welcome back! Please enter your details</p>
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
          <p className="text-sm text-gray-500 mt-2">Sign in to access admin dashboard</p>
        </div>
      )}

      {/* Input Fields */}
      <InputField
        label={loginType === 'user' ? 'Username or Email' : 'Admin Username'}
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder={loginType === 'user' ? 'Enter your username or email' : 'Enter admin username'}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />

      {/* Submit Button */}
      <SubmitButton 
        text={loginType === 'user' ? 'Login' : 'Login as Admin'} 
        loading={loading} 
      />

      {/* Admin Demo Credentials */}
      {loginType === 'admin' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-gray-500">Username: admin</p>
          <p className="text-xs text-gray-500">Password: admin123</p>
        </div>
      )}

      {/* Register Link (User only) */}
      {loginType === 'user' && (
        <p className="text-center mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-red-500 hover:underline font-semibold">
            Register
          </Link>
        </p>
      )}
    </form>
  )
}
