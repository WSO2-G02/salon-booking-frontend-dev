"use client";

import { useEffect, useState } from "react";
import { userApiFetch } from "@/lib/userApi";
import { Mail, Phone, Calendar } from "lucide-react";

interface Profile {
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProfileDetails() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await userApiFetch("/api/v1/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      setProfile(await res.json());
    } catch {
      setError("Unable to load profile details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ---------------------------------------------------
  // 🟡 LUXURY SKELETON LOADER
  // ---------------------------------------------------
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">

          {/* Gold Line */}
          <div className="flex justify-center mb-4">
            <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
          </div>

          {/* Skeleton Heading */}
          <div className="mx-auto h-8 bg-gray-200 rounded w-56 mb-10 animate-pulse"></div>

          {/* Skeleton Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-gray-100 shadow animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 rounded bg-gray-300"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>

                <div className="h-5 w-40 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  // ---------------------------------------------------
  // ERROR
  // ---------------------------------------------------
  if (error || !profile) {
    return (
      <section className="py-16 text-center text-red-500">
        {error || "Profile unavailable"}
      </section>
    );
  }

  // ---------------------------------------------------
  // ACTUAL CONTENT
  // ---------------------------------------------------
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* GOLD ACCENT + HEADING */}
        <div className="flex justify-center mb-4">
          <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
        </div>
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 tracking-wide">
          Profile Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={profile.email}
          />

          <InfoCard
            icon={<Phone className="w-5 h-5" />}
            label="Phone"
            value={profile.phone}
          />

          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Member Since"
            value={profile.created_at?.split("T")[0]}
          />

          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Last Updated"
            value={profile.updated_at?.split("T")[0]}
          />
        </div>

      </div>
    </section>
  );
}

// ---------------------------------------------------
// INFO CARD COMPONENT
// ---------------------------------------------------
function InfoCard({ icon, label, value }: any) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 shadow hover:shadow-md transition">
      <div className="flex items-center gap-3 text-gray-600 mb-1">
        {icon}
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      <p className="text-gray-900">{value || "Not provided"}</p>
    </div>
  );
}
