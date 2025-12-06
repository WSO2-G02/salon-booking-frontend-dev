import { getStaffAvailability, getStaffMembers } from "@/services/staffService";
import { useEffect, useState } from "react";
import { StaffAvailabilityResponse } from "@/services/staffService";
import { on } from "events";
import { Clock, Loader2 } from "lucide-react";
interface Props {
  onAvailabilityChange: (time: string) => void;
  closeModal: () => void;
  staffId: number;
  date?: string;
  durationMinutes?: number;
}

export default function CheckAvailability({
  onAvailabilityChange,
  closeModal,
  staffId,
  date,
  durationMinutes,
}: Props) {
  const [availability, setAvailability] =
    useState<StaffAvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date && durationMinutes) {
    //   setLoading(true);
      getStaffAvailability(staffId, date, durationMinutes)
        .then((res) => {
          setAvailability(res);
        })
        .catch((err) => {
          console.error("Error fetching staff availability:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [date, durationMinutes, staffId]);

  const dummySlots = [
    { start_time: "10:00 AM" },
    { start_time: "11:00 AM" },
    { start_time: "01:00 PM" },
    { start_time: "02:00 PM" },
  ];

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 ">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 opacity-100 ">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock size={18} className="text-orange-500 bold" />
          <h2 className="text-xl font-bold text-gray-900">
            Available Time Slots
          </h2>
        </div>
        {loading && (
          <div className="flex justify-center items-center gap-2 text-gray-500 mt-4">
            <Loader2 className="w-5 h-5 animate-spin" /> Checking
            availability...
          </div>
        )}

        {!loading && dummySlots && dummySlots.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto mb-6">
            {dummySlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlot(slot.start_time)}
                className={`w-full p-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedSlot === slot.start_time
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {slot.start_time}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-sm">
            No available slots
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              onAvailabilityChange(selectedSlot);
              closeModal();
            }}
            disabled={!selectedSlot}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors text-sm hover:scale-[1.01] transition shadow-md disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
          <button
            onClick={() => closeModal()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
