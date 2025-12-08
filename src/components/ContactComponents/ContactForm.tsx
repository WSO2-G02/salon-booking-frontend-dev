'use client';

export default function ContactForm() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">

      {/* Gold Accent */}
      <div className="h-1 w-16 bg-yellow-500 rounded-full mb-4"></div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-3 tracking-wide text-gray-900">
        Send a Message
      </h2>

      {/* Subtitle */}
      <p className="text-gray-600 mb-8 leading-relaxed">
        Have a question or need help?  
        Fill out the form below and our AURORA team will reach out to you shortly.
      </p>

      {/* Contact Form */}
      <form className="space-y-6">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Name *"
            className="w-full border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500
                       transition shadow-sm hover:shadow-md"
          />

          <input
            type="email"
            placeholder="Your Email *"
            className="w-full border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500
                       transition shadow-sm hover:shadow-md"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Contact"
            className="w-full border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500
                       transition shadow-sm hover:shadow-md"
          />

          <input
            type="text"
            placeholder="Subject *"
            className="w-full border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500
                       transition shadow-sm hover:shadow-md"
          />
        </div>

        {/* Message Box */}
        <textarea
          placeholder="Your message..."
          className="w-full border border-gray-300 p-3 rounded-lg h-32
                     focus:outline-none focus:ring-2 focus:ring-yellow-500
                     transition shadow-sm hover:shadow-md"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-semibold rounded-lg
                     hover:bg-yellow-600 hover:text-black transition
                     tracking-wide shadow-md hover:shadow-lg"
        >
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
}
