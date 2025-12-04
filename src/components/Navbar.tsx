'use client'
import Link from 'next/link'

export default function Navbar() {
  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black text-white">
      <div className="text-3xl font-bold tracking-widest">AURORA</div>

      <div className="space-x-8 hidden md:flex">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="hover:text-red-400 font-semibold"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex space-x-3">
        <Link
          href="/booknow"
          className="flex items-center justify-center"
        >
        <button className="border border-white px-4 py-2 hover:bg-white hover:text-black transition">
          BOOK NOW
        </button>
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center"
        >
          <button className="border border-white p-2 rounded hover:bg-white hover:text-black transition">
            👤
          </button>
        </Link>
      </div>
    </nav>
  )
}
