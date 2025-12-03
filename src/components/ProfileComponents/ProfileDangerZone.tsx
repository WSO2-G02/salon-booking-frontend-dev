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
    <section className="py-20 bg-red-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-red-700">Danger Zone</h2>
        <p className="text-red-500 mt-2">
          Logging out will immediately end your session.
        </p>

        <button
          onClick={logout}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </section>
  );
}
