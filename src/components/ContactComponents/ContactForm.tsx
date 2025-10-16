'use client'

export default function ContactForm() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">SEND A MESSAGE</h2>
      <p className="text-gray-600 mb-6">
        Have a question or need assistance? Fill out the form below and our team
        will get back to you.
      </p>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name*"
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="email"
            placeholder="Your email*"
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your contact"
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="text"
            placeholder="Subject*"
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <textarea
          placeholder="Your message..."
          className="border border-gray-300 p-3 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-red-400"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-semibold rounded hover:bg-red-500 transition"
        >
          SEND MESSAGE
        </button>
      </form>
    </div>
  )
}
