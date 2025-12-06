"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { getAvailableSlots } from "@/services/appointmentService";
import { getStaffAvailability, getStaffMembers } from "@/services/staffService";
import {
  StaffAvailabilityResponse,
  StaffResponse,
} from "@/services/staffService";
import StylistCard from "./StylistCard";

interface Props {
  onNext: (data: { date: string, time: string, staffId: number}) => void;
  prevData?: { date: string, time: string };
  staffId?: number;
  serviceId?: number;
}

export default function StepPickDate({
  onNext,
  prevData,
  staffId = 1,
  serviceId = 1,
}: Props) {
  const [date, setDate] = useState(prevData?.date || "");
  const [selectedTime, setSelectedTime] = useState(prevData?.time || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffResponse[]>([]);

  const x = [1, 2, 3,4,5,6];

  const durationMinutes = 60; // assuming 1 hour service duration

  // 🔄 Fetch available slots when date changes
  // useEffect(() => {
  //   if (!date) return;
  //   setLoading(true);
  //   setError("");
  //   getStaffAvailability(staffId, date, durationMinutes)
  //     .then((res) => setAvailableStaff(res))
  //     .catch((err) => setError(err.message));
  //   getAvailableSlots(staffId, serviceId, date)
  //     .then((res) => setSlots(res.available_slots))
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false));
  // }, [date, serviceId, staffId]);

  useEffect(() => {
    // Fetch staff members on component mount
    console.log("Getting Staff Member details");
    getStaffMembers(1, 10, true)
      .then((res) => {
         setStaffMembers(res);
      })
      .catch((err) => {
        console.error("Error fetching staff members:", err);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center relative py-10  w-full">
      <div className="relative bg-white/80 backdrop-blur-xl border border-yellow-200 shadow-xl rounded-2xl p-10 w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
          Select Your Date & Time
        </h2>
        <p className="text-gray-600 mb-8">
          Choose a date for your appointment.
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



          {error && <p className="text-red-500">{error}</p>}

          {date && !loading && (
            <div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                Select Your Stylist
              </h2>
              <div className="grid grid-cols-3 gap-4 w-full">
                {x.map((staff) => (
                  // <StylistCard
                  //   key={staff.id}
                  //   staffId={staff.id}
                  //   name={`Stylist ${staff.id}`}
                  //   specialties={staff.specialties ? staff.specialties.split(",") : []} 
                  //   date={date}
                  //   durationMinutes={durationMinutes}
                  // />
                  <StylistCard
                    onClickCheckAvailability={(data) => { setSelectedTime(data.time); }}
                    key={staff}
                    staffId={staff} name="John Doe" 
                    specialties={["Hair","Beard","Manicure","Pedicure"]}
                    date={date}
                    durationMinutes={durationMinutes}/>
                ))}
              </div>
            </div>
          )}



          <button
            disabled={!selectedTime}
            onClick={() => onNext({
              date: date,
              time: selectedTime,
              staffId: 1,
            })}
            className={`mt-8 w-full max-w-sm py-3 rounded-full font-semibold tracking-wide transition-all duration-300 ${
              selectedTime
                ? "bg-gray-900 text-white shadow-lg hover:scale-[1.03]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
