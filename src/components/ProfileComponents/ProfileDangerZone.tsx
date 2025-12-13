"use client";

import { LogOut } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function ProfileDangerZone() {
  function logout() {
    localStorage.clear();
    showToast("Logged out successfully", "success");
    window.location.href = "/login";
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* GOLD ACCENT + TITLE */}
        <div className="flex justify-center mb-4">
          <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
        </div>

        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 tracking-wide">
          Account Settings
        </h2>

        <div className="p-6 border rounded-xl shadow bg-red-50">

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Sign Out</p>
              <p className="text-sm text-gray-600 mt-1">End your current session</p>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 
                         bg-red-600 hover:bg-red-700 text-white rounded-lg 
                         transition-colors font-medium shadow"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
