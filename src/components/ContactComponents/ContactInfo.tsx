'use client'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">GET IN TOUCH</h2>
      <p className="text-gray-600 mb-6">
        Start your journey with us today. Reach out for expert care,
        corporate appointments, or personalized consultations.
      </p>

      <ul className="space-y-5 text-lg">
        <li className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-red-500" />
          <span>WSO2 Headquarters, 19 Clifford Avenue, Colombo 03, Sri Lanka</span>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-red-500" />
          <span>9.00 AM – 06.00 PM, Monday – Friday</span>
        </li>
        <li className="flex items-start gap-3">
          <Phone className="w-6 h-6 text-red-500" />
          <span>+94 11 743 0000</span>
        </li>
        <li className="flex items-start gap-3">
          <Mail className="w-6 h-6 text-red-500" />
          <span>contact@wso2.com</span>
        </li>
      </ul>
    </div>
  )
}
