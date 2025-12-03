"use client";

import { useEffect, useState } from "react";
import { userApiFetch } from "@/lib/userApi";
import { ShieldCheck, ShieldAlert, User, Pencil } from "lucide-react";
import EditProfileModal from "./EditProfileModal"

export default function ProfileHeader() {
  const [profile, setProfile] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  async function load() {
    const res = await userApiFetch("/profile", { method: "GET" });
    const data = await res.json();
    setProfile(data);
  }

  useEffect(() => {
    load();
  }, []);

  if (!profile) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
        <h2 className="text-3xl font-bold">Loading Profile...</h2>
      </section>
    );
  }

  const initials =
    profile.full_name
      ?.split(" ")
      .map((x: string) => x[0])
      .join("") || profile.username?.slice(0, 2).toUpperCase();

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-900 to-black text-white">
        <div className="max-w-5xl mx-auto px-6 text-center relative">

          {/* Edit Profile Button */}
          <button
            onClick={() => setShowEdit(true)}
            className="absolute right-0 top-0 mt-4 mr-4 bg-white text-slate-800 px-4 py-2 rounded-lg shadow hover:bg-slate-100 flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>

          {/* Avatar */}
          <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-4xl font-bold shadow-xl">
            {initials}
          </div>

          {/* Name */}
          <h1 className="text-4xl mt-6 font-bold">{profile.full_name}</h1>
          <p className="text-slate-400 text-lg">@{profile.username}</p>

          {/* Badges */}
          <div className="flex justify-center gap-3 mt-4">

            <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-sm">
              <User className="w-4 h-4" />
              {profile.email}
            </span>

            {profile.user_type === "admin" ? (
              <span className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-sm">
                <ShieldAlert className="w-4 h-4" />
                Admin
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full text-sm">
                <ShieldCheck className="w-4 h-4" />
                User
              </span>
            )}
          </div>
        </div>
      </section>

      {/* EDIT MODAL */}
      {showEdit && (
        <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} onUpdated={load} />
      )}
    </>
  );
}
