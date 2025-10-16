export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 px-10 grid md:grid-cols-3 gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">LIYO</h1>
        <div className="flex gap-3">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-tiktok"></i></a>
        </div>
      </div>
      <div>
        <h2 className="text-red-500 font-bold mb-2">Quick Links</h2>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Terms & Conditions</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h2 className="text-red-500 font-bold mb-2">Contact Us</h2>
        <p>Tuesday–Sunday: 9:00am–7:00pm</p>
        <p>No.6, Pagoda Road, Nugegoda</p>
        <p>📞 +94 77 388 5122</p>
      </div>
    </footer>
  )
}
