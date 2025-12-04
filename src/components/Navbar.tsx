"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { log } from "console";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    // initialize

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    console.log("Navbar token:", token);
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // dispatch custom event to notify same-tab listeners
    window.dispatchEvent(
      new CustomEvent("localstorage-changed", {
        detail: { key: "access_token", newValue: null },
      })
    );
    setIsLoggedIn(false);
    router.push("/login");
  };

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
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <Link href="/booknow" className="flex items-center justify-center">
              <button className="border border-white p-2 rounded hover:bg-white hover:text-black transition">
                Book Now
              </button>
            </Link>
          </div>
        ) : (
          <Link href="/login" className="flex items-center justify-center">
            <button className="border border-white p-2 rounded hover:bg-white hover:text-black transition">
              Book Now
            </button>
          </Link>
        )}
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="border border-white px-3 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Logout
            </button>
            <Link href="/profile" className="flex items-center justify-center">
              <button className="border border-white p-2 rounded hover:bg-white hover:text-black transition">
                👤
              </button>
            </Link>
          </div>
        ) : (
          <Link href="/login" className="flex items-center justify-center">
            <button className="border border-white p-2 rounded hover:bg-white hover:text-black transition">
              👤
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
