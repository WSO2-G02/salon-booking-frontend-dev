"use client";

import { useEffect, useState } from "react";
import { servicesApiFetch } from "@/lib/servicesApi";   // ✅ FIXED IMPORT

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await servicesApiFetch("/services", { method: "GET" }); // ✅ FIXED
        const data = await res.json();

        console.log("Services API response:", data);

        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setError("Server returned invalid data");
          setServices([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
      }
    }

    load();
  }, []);

  if (error) {
    return (
      <section className="py-20 px-10">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-20 px-10 grid md:grid-cols-2 gap-10">
      {services.map((s) => (
        <div key={s.id} className="flex gap-6">
          <img
            src="https://www.salonliyo.com/assets/images/our-service.png"
            className="rounded-lg w-1/2 object-cover"
          />

          <div>
            <h2 className="text-3xl font-bold">{s.name}</h2>
            <p>{s.description}</p>

            <p className="text-sm text-gray-600 mt-2">
              Category: {s.category} • Rs. {s.price} • {s.duration_minutes} min
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
