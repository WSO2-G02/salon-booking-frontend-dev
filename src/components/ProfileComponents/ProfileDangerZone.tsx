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
        <h2 className="text-2xl font-bold mb-8">Account</h2>

        <div className="p-6 border rounded-xl shadow-sm bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Sign Out</p>
              <p className="text-sm text-slate-500 mt-1">End your current session</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
