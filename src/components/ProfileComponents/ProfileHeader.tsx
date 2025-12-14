"use client";

import { useEffect, useState } from "react";
import { userApiFetch } from "@/lib/userApi";
import { ShieldCheck, ShieldAlert, User, Pencil } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

interface Profile {
  full_name?: string;
  username?: string;
  is_verified?: boolean;
  email?: string;
  phone?: string;
  user_type?: string;
}

export default function ProfileHeader() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  // --------------------------------------------------------------------
  // FETCH PROFILE
  // --------------------------------------------------------------------
  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await userApiFetch("/api/v1/profile");

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); // <- FIXED (this was fetchUserProfile, which didn't exist)
  }, []);

  // --------------------------------------------------------------------
  // LOADING SKELETON
  // --------------------------------------------------------------------
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 to-black text-white relative">
        <div className="max-w-5xl mx-auto px-6 text-center">

          {/* Fake Edit Button */}
          <div className="absolute right-0 top-0 mt-4 mr-4">
            <div className="w-20 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Avatar Skeleton */}
          <div className="mx-auto w-28 h-28 rounded-full bg-gray-700 animate-pulse"></div>

          {/* Name Skeleton */}
          <div className="mx-auto mt-6 h-8 w-56 bg-gray-700 rounded animate-pulse"></div>

          {/* Username Skeleton */}
          <div className="mx-auto mt-3 h-5 w-40 bg-gray-600 rounded animate-pulse"></div>

          {/* Badges Skeleton */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <div className="w-32 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          </div>

        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------------------
  if (error || !profile) {
    return (
      <section className="py-20 bg-gradient-to-br from-red-900 to-black text-white text-center">
        <h2 className="text-2xl font-bold">{error || "Profile unavailable"}</h2>
      </section>
    );
  }

  // --------------------------------------------------------------------
  // INITIALS
  // --------------------------------------------------------------------
  const initials =
    profile.full_name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase() ||
    profile.username?.slice(0, 2).toUpperCase() ||
    "U";

  // --------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------
  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-900 to-black text-white relative">
        <div className="max-w-5xl mx-auto px-6 text-center relative">

          {/* Edit Button */}
          <button
            onClick={() => setShowEdit(true)}
            className="absolute right-0 top-0 mt-4 mr-4 bg-white text-slate-900 
                       px-4 py-2 rounded-lg shadow hover:bg-slate-200 
                       flex items-center gap-2 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>

          {/* Avatar */}
          <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br 
                          from-red-400 to-red-600 flex items-center justify-center 
                          text-4xl font-bold shadow-xl">
            {initials}
          </div>

          {/* Name */}
          <h1 className="text-4xl mt-6 font-bold">{profile.full_name}</h1>
          <p className="text-slate-400 text-lg">@{profile.username}</p>

          {/* Badges */}
          <div className="flex justify-center gap-3 mt-5 flex-wrap">

            {/* Email */}
            <span className="flex items-center gap-2 bg-slate-800 
                             px-4 py-2 rounded-full text-sm">
              <User className="w-4 h-4" />
              {profile.email}
            </span>

            {/* Role */}
            {profile.user_type === "admin" ? (
              <span className="flex items-center gap-2 bg-red-600 px-4 py-2 
                               rounded-full text-sm">
                <ShieldAlert className="w-4 h-4" />
                Admin
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-green-600 px-4 py-2 
                               rounded-full text-sm">
                <ShieldCheck className="w-4 h-4" />
                User
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onUpdated={load}
        />
      )}
    </>
  );
}
