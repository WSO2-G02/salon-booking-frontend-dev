import { getAvailableSlots } from "@/services/appointmentService";
import CheckAvailability from "./CheckAvailability";
import { useState } from "react";
import { Gem } from "lucide-react";
interface Props {
  onClickCheckAvailability: (data: { time: string }) => void;
  staffId: number;
  name: string;
  specialties: string[];
  date: string;
  durationMinutes: number;
}

export default function StylistCard({ ...props }: Props) {
 const [showAvailability, setShowAvailability] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="card p-18 shadow-lg rounded-xl bg-white w-l">
      <div className="flex items-center gap-6 mb-6">
        <img
          className="w-16 h-16 rounded-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG8p2IDkdD_RHd2oh3FOmcXmZxpvy0zDGHrw&s"
          alt="stylist_avatar"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {props.name}
          </h3>
          <p className="text-sm text-gray-600">Staff ID: {props.staffId}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium font-semibold text-gray-800 mb-3 text-left flex items-center gap-2"><Gem size={18} className="text-orange-500" />Specialties</p>
        <div className="flex flex-wrap gap-3">
          {props.specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-lg"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition shadow-md" onClick={() => setShowAvailability(true)}>
        Check Availability
      </button>
      {showAvailability && (
        <CheckAvailability staffId={props.staffId} date={props.date} durationMinutes={props.durationMinutes} onAvailabilityChange={(time) => {  setSelectedTime(time); props.onClickCheckAvailability({ time }); }} closeModal={() => setShowAvailability(false)} />
      )}
    </div>
  );
}
