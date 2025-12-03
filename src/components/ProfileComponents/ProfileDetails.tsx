"use client";

import { useEffect, useState } from "react";
import { userApiFetch } from "@/lib/userApi";
import { Mail, Phone, Calendar } from "lucide-react";

export default function ProfileDetails() {
  const [profile, setProfile] = useState<any>(null);

  async function load() {
    const res = await userApiFetch("/profile", { method: "GET" });
    const data = await res.json();
    setProfile(data);
  }

  useEffect(() => {
    load();
  }, []);

  if (!profile) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8">Profile Information</h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Email */}
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Email</span>
            </div>
            <p className="text-slate-800">{profile.email}</p>
          </div>

          {/* Phone */}
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">Phone</span>
            </div>
            <p className="text-slate-800">{profile.phone || "Not provided"}</p>
          </div>

          {/* Created */}
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Member Since</span>
            </div>
            <p className="text-slate-800">{profile.created_at.split("T")[0]}</p>
          </div>

          {/* Updated */}
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Last Updated</span>
            </div>
            <p className="text-slate-800">{profile.updated_at.split("T")[0]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
