"use client";

import { useEffect, useState } from "react";
import { servicesApiFetch } from "@/lib/servicesApi";   // ✅ FIXED IMPORT

interface Props {
  onSelect: (service: string) => void;
  selected: string;
}

export default function StepSelectService({ onSelect, selected }: Props) {
  // Frontend-only images mapped by index
  const serviceImages = [
    {
      img: "data:image/webp;base64,UklGRtogAABXRUJQVlA4IM4gAADQsQCdASo7AdgAPp1Cm0qlo6MkqJM9eLATiUAYsU+7c+r/o6kftcJS9R5u8IXcgN+3iis1uNLESNR3zxe1Qs8d4Ov2/fkmLJU+dAe51pk/w1tVM6NbV2Czxvy3zy63W6akB3x2XZI0y/WQG/eebKK+ONTV7GA..."
    },
    {
      img: "https://tse4.mm.bing.net/th/id/OIP.dSG8Ou25jsFSotjhhjsOEgHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      img: "data:image/webp;base64,UklGRnonAABXRUJQVlA4IG4nAABQpgCdASrkAB0BPp1AmEklo6IurFn9YdATiWNtgsgP3FExRa..."
    }
  ];

  const [services, setServices] = useState<any[]>([]);
  const fallbackImage =
    "https://via.placeholder.com/300x200.png?text=Salon+Service";

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await servicesApiFetch("/services", { method: "GET" }); // ✅ FIXED
        const data = await res.json();

        const withImages = data.map((s: any, index: number) => ({
          ...s,
          img: serviceImages[index]?.img || fallbackImage
        }));

        setServices(withImages);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }

    loadServices();
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-2">Select an Appointment Type</h2>
      <p className="text-gray-600 mb-6">
        Choose your preferred service to continue booking.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {services.map((s: any) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.name)}
            className={`cursor-pointer border rounded-lg p-3 w-60 shadow transform transition hover:scale-105 ${
              selected === s.name
                ? "border-black ring-2 ring-red-400"
                : "border-gray-200"
            }`}
          >
            <img
              src={s.img}
              alt={s.name}
              className="rounded mb-2 h-40 w-full object-cover"
            />

            <h3 className="font-semibold">{s.name}</h3>

            <p className="text-sm text-gray-500">
              Rs. {s.price} • {s.duration_minutes} min
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
