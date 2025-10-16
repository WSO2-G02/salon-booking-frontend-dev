'use client'

import { bookAppointment } from '@/services/appointmentService'
import { useState } from 'react'

interface Props {
  service: string
  date: string
  time: string
}

export default function StepConfirmPayment({ service, date, time }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleConfirm = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await bookAppointment({
        service_id: service,
        appointment_datetime: `${date}T${time}`,
      })
      setStatus(`✅ Appointment confirmed! ID: ${res.appointment_id}`)
    } catch (err: any) {
      setStatus(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-2">Confirm & Payment</h2>
      <p className="text-gray-600 mb-6">Review your details and confirm your booking.</p>

      <div className="border rounded-lg p-6 max-w-md mx-auto bg-white shadow">
        <p className="font-semibold mb-2">Service: <span className="text-red-500">{service}</span></p>
        <p className="mb-2">Date: {date}</p>
        <p className="mb-4">Time: {time}</p>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-black hover:bg-red-500'
          }`}
        >
          {loading ? 'Processing...' : 'Confirm Appointment'}
        </button>

        {status && <p className="mt-4">{status}</p>}
      </div>
    </div>
  )
}
