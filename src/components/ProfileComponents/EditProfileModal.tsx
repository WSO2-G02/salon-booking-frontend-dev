"use client";

import { useState } from "react";
import { userApiFetch } from "@/lib/userApi";
import { showToast } from "@/components/Toast";

export default function EditProfileModal({ profile, onClose, onUpdated }: any) {
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    email: profile.email || "",
  });

  const [saving, setSaving] = useState(false);

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function submit(e: any) {
    e.preventDefault();
    setSaving(true);

    const res = await userApiFetch("/profile", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.detail || "Failed to update profile", "error");
      setSaving(false);
      return;
    }

    showToast("Profile updated!", "success");
    setSaving(false);
    onClose();
    onUpdated(); // reload profile
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-xl w-96 animate-fadeIn"
      >
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
