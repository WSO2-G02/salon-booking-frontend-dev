"use client";

import { bookAppointment } from "@/services/appointmentService";
import { getUserProfile } from "@/services/userService";
import { showToast } from "@/components/Toast";
import { use, useEffect, useState } from "react";

interface Props {
  onNext?: (data: any) => void;
  service: any;
  date: string;
  time: string;
  staffId?: number;
  durationMinutes?: number;
}

export default function StepConfirmPayment({
  onNext,
  service,
  date,
  time,
  staffId,
  durationMinutes,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState<number>();
  const [notes, setNotes] = useState<string>("");
  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        console.log(profile)
        setUserID(profile.id);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleConfirm = async () => {
    console.log("Staff ID", staffId)
    setLoading(true);
    let formattedTime = time;
    if (time.includes("PM")) {
      const [hourStr, minuteStr] = time.replace(" PM", "").split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      if (hour !== 12) {
        hour += 12;
      }
      formattedTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    }else if (time.includes("AM")) {
      const [hourStr, minuteStr] = time.replace(" AM", "").split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      if (hour === 12) {
        hour = 0;
      }
      formattedTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    }
    const appointment_datetime = `${date}T${formattedTime}`;
    try {

      const res = await bookAppointment({
        user_id: userID,
        service_id: service.id,
        staff_id: staffId!,
        appointment_date: date,
        appointment_datetime: appointment_datetime,
        customer_notes: notes!,
      });
      setAppointmentData(res.data.appointment);
      console.log("StepConfirmPayment:", res);
      showToast(`Appointment confirmed! ID: ${res.data.appointment.id}`, "success");
      if (onNext) onNext(res.data.appointment);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl text-black font-bold mb-2"> Confirm & Payment</h2>
      <p className="text-gray-600 mb-6">
        Review your details and confirm your booking.
      </p>

      <div className="border rounded-lg p-6 max-w-md mx-auto bg-white shadow">
        <p className="font-semibold mb-2 text-black">
          Service: <span className="text-gray-500">{service.name}</span>
        </p>
        <p className="mb-2 text-gray-600">Price: {service.price} LKR</p>
        <p className="mb-2 text-gray-600">
          Duration: {service.duration} minutes
        </p>
        <p className="mb-2 text-gray-600">Date: {date}</p>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none"
          placeholder="Additional notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <button 
          onClick={handleConfirm}
          disabled={loading && !userID}
          className={`px-6 py-2 rounded-full text-white ${
            loading ? "bg-gray-400" : "bg-gray-800 hover:bg-black"
          }`}
        >
          {loading ? "Processing..." : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}
