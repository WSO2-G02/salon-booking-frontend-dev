'use client';

import { useState } from 'react';
import InputField from '@/components/RegisterComponents/InputField';
import SubmitButton from '@/components/RegisterComponents/SubmitButton';
import { loginUser } from '@/services/userService';
import { showToast } from '@/components/Toast';
import Link from 'next/link';
import { Token } from '@/lib/auth';

type LoginType = 'user' | 'admin';

export default function LoginForm() {
  const [loginType, setLoginType] = useState<LoginType>('user');
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** ======================================================
   * USER LOGIN
   * ====================================================== */
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);

      // store tokens properly
      Token.setLoginTokens(res.access_token, res.refresh_token, res.expires_in);

      showToast('Login successful!', 'success');

      setTimeout(() => {
        window.location.href = '/profile';
      }, 800);

    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /** ======================================================
   * ADMIN LOGIN
   * (backend determines if credentials belong to admin)
   * ====================================================== */
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);

      Token.setLoginTokens(res.access_token, res.refresh_token, res.expires_in);

      // Mark admin locally (OPTIONAL) if backend returns role
      localStorage.setItem('admin_token', res.access_token);

      showToast('Admin login successful!', 'success');

      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 800);

    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit =
    loginType === 'user' ? handleUserLogin : handleAdminLogin;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10 border border-gray-200"
    >
      {/* Login Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => { setLoginType('user'); setForm({ username: '', password: '' }); }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            loginType === 'user'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          User Login
        </button>

        <button
          type="button"
          onClick={() => { setLoginType('admin'); setForm({ username: '', password: '' }); }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            loginType === 'admin'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Admin Login
        </button>
      </div>

      {/* Form Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {loginType === 'user' ? 'Login to Your Account' : 'Admin Portal Login'}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          {loginType === 'user'
            ? 'Welcome back! Enter your details below'
            : 'Access the admin dashboard securely'}
        </p>
      </div>

      {/* Inputs */}
      <InputField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Enter username"
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter password"
      />

      {/* Submit */}
      <SubmitButton text="Login" loading={loading} />

      {/* Register (user only) */}
      {loginType === 'user' && (
        <p className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/register" className="text-red-500 font-semibold">
            Register
          </Link>
        </p>
      )}
    </form>
  );
}
