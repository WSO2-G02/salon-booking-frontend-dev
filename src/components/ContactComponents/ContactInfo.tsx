'use client'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

export default function ContactInfo() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">

      {/* Gold Accent */}
      <div className="h-1 w-16 bg-yellow-500 rounded-full mb-4"></div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-3 tracking-wide text-gray-900">
        Get In Touch
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-8 leading-relaxed">
        Whether you're looking for beauty consultations, bookings, or corporate appointments,  
        our team at AURORA is here to assist you with warmth and professionalism.
      </p>

      {/* List */}
      <ul className="space-y-6 text-lg">

        <li className="flex items-start gap-4 group">
          <MapPin className="w-7 h-7 text-yellow-600 group-hover:text-yellow-700 transition" />
          <span className="text-gray-700 group-hover:text-black transition">
            WSO2 Headquarters, 19 Clifford Avenue, Colombo 03, Sri Lanka
          </span>
        </li>

        <li className="flex items-start gap-4 group">
          <Clock className="w-7 h-7 text-yellow-600 group-hover:text-yellow-700 transition" />
          <span className="text-gray-700 group-hover:text-black transition">
            9.00 AM – 06.00 PM  
            <span className="block text-sm text-gray-500">Monday – Friday</span>
          </span>
        </li>

        <li className="flex items-start gap-4 group">
          <Phone className="w-7 h-7 text-yellow-600 group-hover:text-yellow-700 transition" />
          <span className="text-gray-700 group-hover:text-black transition">
            +94 11 743 0000
          </span>
        </li>

        <li className="flex items-start gap-4 group">
          <Mail className="w-7 h-7 text-yellow-600 group-hover:text-yellow-700 transition" />
          <span className="text-gray-700 group-hover:text-black transition">
            contact@wso2.com
          </span>
        </li>

      </ul>
    </div>
  )
}
