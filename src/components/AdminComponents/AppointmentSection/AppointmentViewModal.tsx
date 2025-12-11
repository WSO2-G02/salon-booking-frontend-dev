"use client";

import {
    X,
    Calendar,
    User,
    UserCheck,
    Tag,
    DollarSign,
    Clock,
    MessageSquare,
    FileText,
} from "lucide-react";
import { useEffect } from "react";



interface Props {
    isOpen: boolean;
    onClose: () => void;
    appointment: any;
}

export default function AppointmentViewModal({ isOpen, onClose, appointment }: Props) {


    if (!isOpen || !appointment) return null;

    const fmt = (v?: string | null) =>
        v ? new Date(v).toLocaleString() : "N/A";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <Calendar size={24} className="text-red-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Appointment Details
                            </h3>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4 text-sm">

                        {/* Row Info */}
                        <div className="space-y-3">

                            {/* Appointment ID */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <Tag size={14} className="mr-2 text-gray-400" />
                                    Appointment ID
                                </p>
                                <p className="font-medium text-gray-800">{appointment.id}</p>
                            </div>

                            {/* Status */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <FileText size={14} className="mr-2 text-gray-400" />
                                    Status
                                </p>
                                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 capitalize">
                                    {appointment.status}
                                </span>
                            </div>

                            {/* User ID */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <User size={14} className="mr-2 text-gray-400" />
                                    User ID
                                </p>
                                <p className="font-medium text-gray-800">{appointment.user_id}</p>
                            </div>

                            {/* Staff ID */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <UserCheck size={14} className="mr-2 text-gray-400" />
                                    Staff ID
                                </p>
                                <p className="font-medium text-gray-800">
                                    {appointment.staff_id ?? "Unassigned"}
                                </p>
                            </div>

                            {/* Service ID */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <Tag size={14} className="mr-2 text-gray-400" />
                                    Service ID
                                </p>
                                <p className="font-medium text-gray-800">{appointment.service_id}</p>
                            </div>

                            {/* Price */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <DollarSign size={14} className="mr-2 text-gray-400" />
                                    Price
                                </p>
                                <p className="font-medium text-black">
                                    {appointment.service_price}
                                </p>
                            </div>

                            {/* Date & Time */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <Clock size={14} className="mr-2 text-gray-400" />
                                    Appointment Time
                                </p>
                                <p className="font-medium text-gray-800">
                                    {fmt(appointment.appointment_datetime)}
                                </p>
                            </div>

                            {/* Duration */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 flex items-center">
                                    <Clock size={14} className="mr-2 text-gray-400" />
                                    Duration
                                </p>
                                <p className="font-medium text-gray-800">
                                    {appointment.duration_minutes} min
                                </p>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-3 pt-2">
                            <div className="py-2">
                                <p className="text-xs text-gray-500 mb-1 flex items-center">
                                    <MessageSquare size={14} className="mr-2 text-gray-400" />
                                    Customer Notes
                                </p>
                                <p className="font-medium text-gray-800">
                                    {appointment.customer_notes || "—"}
                                </p>
                            </div>

                            <div className="py-2">
                                <p className="text-xs text-gray-500 mb-1 flex items-center">
                                    <MessageSquare size={14} className="mr-2 text-gray-400" />
                                    Staff Notes
                                </p>
                                <p className="font-medium text-gray-800">
                                    {appointment.staff_notes || "—"}
                                </p>
                            </div>

                            {appointment.cancellation_reason && (
                                <div className="py-2">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                                        <X size={14} className="mr-2 text-gray-400" />
                                        Cancellation Reason
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        {appointment.cancellation_reason}
                                    </p>
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Footer */}
                    <div className="flex justify-end p-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-600 hover:text-red-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
