
"use client";

import Link from "next/link";

interface Props {
    appointmentData: any;
}

export default function AppointmentConfirmation( {appointmentData}: Props) {
return(
    <div className="flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            {/* Confirmation Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>

            {/* Appointment ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Appointment ID</p>
                <p className="text-xl font-semibold text-gray-900">{appointmentData?.id || "N/A"}</p>
            </div>
            {/* View Appointments Button */}

            <Link href="/profile">
                <button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                    View My Appointments
                </button>
            </Link>
        </div>
    </div>
  );
}