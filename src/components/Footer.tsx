"use client";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-10">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">

        {/* Brand + Social */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-wide">AURORA</h1>

          <p className="text-gray-400 mb-4">Elegance. Luxury. Beauty.</p>

          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              className="text-gray-300 hover:text-yellow-500 transition text-2xl"
            >
              <i className="fab fa-facebook"></i>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              className="text-gray-300 hover:text-yellow-500 transition text-2xl"
            >
              <i className="fab fa-instagram"></i>
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              className="text-gray-300 hover:text-yellow-500 transition text-2xl"
            >
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-yellow-500 font-semibold text-lg mb-3">Quick Links</h2>

          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-white transition">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">About</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition">Terms & Conditions</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-yellow-500 font-semibold text-lg mb-3">Contact Us</h2>

          <p className="text-gray-400">Tuesday–Sunday: 9:00am–7:00pm</p>

          <a
            href="https://maps.app.goo.gl/P1k8YQwFeKJrA3TP6"
            target="_blank"
            className="block mt-2 hover:text-white transition"
          >
            No.6, Pagoda Road, Nugegoda
          </a>

          <a
            href="tel:+94773885122"
            className="block mt-2 font-semibold hover:text-white transition"
          >
            📞 +94 77 388 5122
          </a>
        </div>
      </div>

      {/* Divider + copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 pt-6 border-t border-gray-800">
        © {new Date().getFullYear()} AURORA Salon. All Rights Reserved.
      </div>

    </footer>
  );
}
