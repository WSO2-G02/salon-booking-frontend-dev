"use client";

import { bookAppointment } from "@/services/appointmentService";
import { getUserProfile } from "@/services/userService";
import { showToast } from "@/components/Toast";
import { use, useEffect, useState } from "react";

interface Props {
  service: any;
  date: string;
  time: string;
  staffId?: number;
  durationMinutes?: number;
}

export default function StepConfirmPayment({
  service,
  date,
  time,
  staffId,
  durationMinutes,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState<number>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserID(profile.id);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleConfirm = async () => {
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
    }
    const appointment_datetime = `${date}T${formattedTime}:00`;
    try {
      const res = await bookAppointment({
        service_id: service,
        user_id: userID!,
        staff_id: staffId!,
        duration_minutes: durationMinutes!,
        appointment_datetime: appointment_datetime,
      });
      showToast(`Appointment confirmed! ID: ${res.appointment_id}`, "success");
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
        <p className="mb-4 text-gray-600">Time: {time}</p>

        <button
          onClick={handleConfirm}
          disabled={loading}
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
