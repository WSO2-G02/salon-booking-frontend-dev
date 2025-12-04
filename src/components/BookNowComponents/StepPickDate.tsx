'use client'
import { useState, useEffect } from 'react'
import { CalendarDays, Clock, Loader2 } from 'lucide-react'
import { getAvailableSlots } from '@/services/appointmentService'

interface Props {
  onNext: (data: { date: string; time: string }) => void
  prevData?: { date: string; time: string }
  staffId?: string
  serviceId?: string
}

export default function StepPickDate({ onNext, prevData, staffId = "1", serviceId = "1" }: Props) {
  const [date, setDate] = useState(prevData?.date || '')
  const [selectedTime, setSelectedTime] = useState(prevData?.time || '')
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 🔄 Fetch available slots when date changes
  useEffect(() => {
    if (!date) return
    setLoading(true)
    setError('')
    getAvailableSlots(staffId, serviceId, date)
      .then((res) => setSlots(res.available_slots))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [date])

  return (
    <div className="flex flex-col items-center justify-center text-center relative py-10">
      <div className="relative bg-white/80 backdrop-blur-xl border border-yellow-200 shadow-xl rounded-2xl p-10 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
          Select Your Date & Time
        </h2>
        <p className="text-gray-600 mb-8">
          Choose a date and available time slot for your appointment.
        </p>

        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center gap-3 w-full max-w-sm border border-gray-300 rounded-lg px-4 py-3 shadow-inner hover:border-yellow-400 transition">
            <CalendarDays className="text-yellow-500 w-6 h-6" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {loading && (
            <div className="flex justify-center items-center gap-2 text-gray-500 mt-4">
              <Loader2 className="w-5 h-5 animate-spin" /> Checking availability...
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && slots.length !== 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                    selectedTime === slot
                      ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg'
                      : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                  }`}
                >
                  <Clock className="inline w-4 h-4 mr-1 text-yellow-500" />
                  {slot}
                </button>
              ))}
            </div>
          )}

          {date && !loading && slots.length === 0 && (
            <p className="text-gray-400 mt-4 italic">No slots available for this day.</p>
          )}

          <button
            disabled={!selectedTime}
            onClick={() => onNext({ date, time: selectedTime })}
            className={`mt-8 w-full max-w-sm py-3 rounded-full font-semibold tracking-wide transition-all duration-300 ${
              selectedTime
                ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg hover:scale-[1.03]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
