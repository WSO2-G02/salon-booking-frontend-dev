"use client";

import {
  Trash2,
  User,
  Briefcase,
  Clock,
  Scissors,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserAppointments } from "@/services/appointmentService";
import { getUserProfile } from "@/services/userService";

export default function MyAppointments() {
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [userID, setUserID] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 1️⃣ Fetch user profile ONCE
  // -----------------------------
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile();
        setUserID(profile.id);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // -----------------------------
  // 2️⃣ Fetch appointments AFTER userID exists
  // -----------------------------
  useEffect(() => {
    if (!userID) return;

    async function fetchAppointments() {
      try {
        const response = await getUserAppointments(userID);
        setAppointmentsList(response);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [userID]);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (appointmentsList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        {/* Gold Line */}
        <div className="flex justify-center mb-4">
          <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
        </div>
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Appointments
        </h3>
        <p className="text-gray-500">
          Let's get started by booking your first appointment!
        </p>
      </div>
    );
  }

  // -----------------------------
  // TABLE RENDER
  // -----------------------------
  return (
    <div className="bg-white text-black rounded-lg shadow-md overflow-hidden p-8">
      {/* Gold Line */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">My Appointments</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Appointment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Staff
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {appointmentsList.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Scissors size={20} className="text-red-600" />
                    </div>
                    <span>ID: {appointment.id}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Lightbulb size={14} className="inline mr-2 text-gray-400" />
                  {appointment.service_id}
                </td>

                <td className="px-6 py-4">
                  <Briefcase size={14} className="inline mr-2 text-gray-400" />
                  {appointment.staff_id}
                </td>

                <td className="px-6 py-4">
                  <Clock size={14} className="inline mr-2 text-gray-400" />
                  {new Date(appointment.appointment_datetime).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                    <span
                    className={`w-24 text-center px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : appointment.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : appointment.status === "no show"
                      ? "bg-gray-100 text-gray-800"
                      : appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                    }`}
                    >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                    </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Cancel Appointment"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
