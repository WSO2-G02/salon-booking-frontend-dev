"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { servicesApiFetch } from "@/lib/servicesApi";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration_minutes: number;
}

// Luxury gradients
const LUXURY_GRADIENTS = [
  "bg-gradient-to-br from-yellow-300 to-amber-600",
  "bg-gradient-to-br from-rose-300 to-rose-600",
  "bg-gradient-to-br from-purple-400 to-indigo-600",
  "bg-gradient-to-br from-emerald-300 to-teal-600",
  "bg-gradient-to-br from-gray-700 to-gray-900",
];

// Extract 2-letter code
const getTwoLetterCode = (name: string): string => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await servicesApiFetch("/api/v1/servicespub");
        const data = await res.json();
        if (Array.isArray(data)) setServices(data);
        else setError("Server returned invalid data");
      } catch {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="flex gap-6 animate-pulse bg-white rounded-xl shadow p-4 items-center">
      <div className="w-24 h-24 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <section className="py-20 px-10 text-center">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-20 px-10 bg-gray-50">

      {/* Gold accent */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6 tracking-wide">
        Our Services
      </h2>

      {/* INTRO + IMAGE AREA (same as products) */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-16">

        {/* Text */}
        <div>
          <p className="text-lg leading-relaxed text-gray-700">
            Explore AURORA’s hand-crafted range of{" "}
            <strong>premium salon services</strong> designed for beauty,
            confidence, and a luxurious self-care experience.
          </p>

          <p className="text-lg leading-relaxed text-gray-700 mt-4">
            From advanced hair treatments to professional skincare and makeover
            packages — every service is performed by expert stylists using
            high-quality, internationally trusted products.
          </p>
        </div>

        {/* Image */}
        <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://www.salonliyo.com/assets/images/our-service.png"
            alt="AURORA Services"
            fill
            className="object-cover"
          />
        </div>

      </div>

      {/* SERVICES GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Skeletons */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {/* Service Cards */}
        {!loading &&
          services.map((s, index) => {
            const gradient = LUXURY_GRADIENTS[index % LUXURY_GRADIENTS.length];
            const code = getTwoLetterCode(s.name);

            return (
              <div
                key={s.id}
                className="flex gap-6 bg-white rounded-xl shadow-sm hover:shadow-xl 
                           transition-all p-4 items-center cursor-pointer"
              >
                {/* Avatar */}
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center 
                              text-3xl font-bold text-white shadow-lg ${gradient}`}
                >
                  {code}
                </div>

                {/* Service Text */}
                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {s.name}
                  </h1>

                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Description:</span> {s.description}
                  </p>

                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Price:</span> Rs. {s.price}
                  </p>

                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Duration:</span> {s.duration_minutes} minutes
                  </p>

                  <span className="inline-block rounded-full bg-gray-100 px-2 py-1 
                                  text-xs text-gray-700 font-medium mt-1">
                    {s.category}
                  </span>
                </div>
              </div>
            );
          })}

      </div>
    </section>
  );
}
