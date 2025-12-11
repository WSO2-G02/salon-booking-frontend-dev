"use client";

import {
  Edit,
  Trash2,
  Calendar,
  User,
  Briefcase,
  Clock,
  Scissors,
  Lightbulb,
} from "lucide-react";

import { getUserAppointments } from "@/services/appointmentService";
import { getUserProfile } from "@/services/userService";
import { useEffect, useState } from "react";

export default function MyAppointments() {
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [userID, setUserID] = useState<number>();

  

  useEffect(() => {
    // Fetch user appointments on component mount
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        console.log(profile)
        setUserID(profile.id);
        fetchAppointments();
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUserProfile();
    const fetchAppointments = async () => {
      try {
        const response = await getUserAppointments(userID!);
        console.log(response)
        setAppointmentsList(response);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    
  }, [userID,appointmentsList]);

  const handleCancelAppointment = (appointmentId: number) => {
    // Implement cancellation logic here
    console.log(`Cancel appointment with ID: ${appointmentId}`);
  };

  // Empty state
  if (appointmentsList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Appointments{" "}
        </h3>
        <p className="text-gray-500">
          Let's get started by booking your first appointment!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">My Appointments</h2>
      {/* ================================================= */}
      {/* TABLE CONTAINER                                  */}
      {/* ================================================= */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Appointment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Staff ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date and Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {appointmentsList.map((appointment) => (
              <tr
                key={appointment.id}
                className={`hover:bg-gray-50 transition-colors ${
                  !appointment.is_active ? "opacity-60" : ""
                }`}
              >
                {/* Appointment ID & Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Scissors size={20} className="text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-s text-gray-500">
                        ID: {appointment.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Service */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Lightbulb size={14} className="mr-2 text-gray-400" />
                    {appointment.service_id}
                  </div>
                </td>

                {/* Staff ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Briefcase size={14} className="mr-2 text-gray-400" />
                    {appointment.staff_id}
                  </div>
                </td>

                {/* Date and Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    <div>
                      {new Date(
                        appointment.appointment_datetime
                      ).toLocaleString()}
                    </div>
                  </div>
                </td>

                {/* Price */}


                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === "active"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                    }`}
                    >
                    {appointment.status === "active" ? "Active" : appointment.status === "pending" ? "Pending" : "Inactive"}
                    </span>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* cancel appointment */}

                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel Appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* PAGINATION                                       */}
      {/* ================================================= */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200"></div>
    </div>
  );
}
