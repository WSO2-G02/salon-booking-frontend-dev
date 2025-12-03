"use client";

import { useEffect, useState } from "react";
import { staffApiFetch } from "@/lib/staffApi";
import { userApiFetch } from "@/lib/userApi";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import { showToast } from "@/components/Toast";

/* ---------------------------
      TYPE DEFINITIONS
---------------------------- */
interface Staff {
  id: number;
  user_id: number;
  employee_id: string;
  position: string;
  specialties: string;
  experience_years: number;
  hire_date: string;
  is_active: boolean;
}

export default function StaffManagementSection() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    employee_id: "",
    position: "",
    specialties: "",
    experience_years: "",
    hire_date: "",
    is_active: "true",
  });

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* ---------------------------
          LOAD STAFF
---------------------------- */
  async function loadStaff() {
    setLoading(true);
    try {
      const res = await staffApiFetch("/staff", { method: "GET" });
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error("Error loading staff:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  /* ---------------------------
      CREATE STAFF + USER
---------------------------- */
  async function createStaff(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Create the user first
      const userRes = await userApiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: form.full_name,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const userData = await userRes.json();
      if (!userRes.ok) {
        throw new Error(userData.detail || "User creation failed");
      }

      // Extract correct nested user ID
      const userId = userData?.data?.user?.id;
      if (!userId) throw new Error("User ID missing from backend.");

      // Create staff entry
      const staffPayload = {
        user_id: userId,
        employee_id: form.employee_id,
        position: form.position,
        specialties: form.specialties,
        experience_years: Number(form.experience_years),
        hire_date: form.hire_date,
        is_active: form.is_active === "true",
      };

      const staffRes = await staffApiFetch("/staff", {
        method: "POST",
        body: JSON.stringify(staffPayload),
      });

      const data = await staffRes.json();
      if (!staffRes.ok) throw new Error(data.detail || "Staff creation failed");

      showToast("Staff member created successfully!", "success");
      setShowAddForm(false);
      loadStaff();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error creating staff", "error");
    }
  }

  /* ---------------------------
          UPDATE STAFF
---------------------------- */
  async function updateExistingStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!editStaff) return;

    const payload = {
      employee_id: form.employee_id,
      position: form.position,
      specialties: form.specialties,
      experience_years: Number(form.experience_years),
      hire_date: form.hire_date,
      is_active: form.is_active === "true",
    };

    try {
      const res = await staffApiFetch(`/staff/${editStaff.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Update failed");

      showToast("Staff updated successfully!", "success");
      setEditStaff(null);
      loadStaff();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  }

  /* ---------------------------
          DELETE STAFF
---------------------------- */
  async function deleteStaff() {
    if (!deletingId) return;
    setDeleting(true);

    try {
      const res = await staffApiFetch(`/staff/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete staff");

      showToast("Staff deleted", "success");
      setShowDeleteModal(false);
      loadStaff();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Users className="text-red-500" /> Staff Management
      </h2>

      {/* -------- Add Button + Active Count -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          onClick={() => {
            setShowAddForm(true);
            setEditStaff(null);
            setForm({
              full_name: "",
              username: "",
              email: "",
              password: "",
              employee_id: "",
              position: "",
              specialties: "",
              experience_years: "",
              hire_date: "",
              is_active: "true",
            });
          }}
          className="cursor-pointer bg-red-500 text-white p-6 rounded-xl shadow hover:bg-red-600 transition"
        >
          <div className="flex items-center gap-3">
            <Plus size={28} />
            <h3 className="text-xl font-semibold">Add New Staff</h3>
          </div>
          <p className="text-sm mt-2">Create a new staff member</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Active Staff</h3>
          <p className="text-2xl font-bold mt-3">
            {staff.filter((s) => s.is_active).length}
          </p>
        </div>
      </div>

      {/* ---------------------------
              STAFF TABLE
      ---------------------------- */}
      <h3 className="text-xl font-bold mb-4">All Staff Members</h3>

      {loading ? (
        <p>Loading…</p>
      ) : staff.length === 0 ? (
        <p>No staff members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border border-gray-300">Employee ID</th>
                <th className="p-3 border border-gray-300">Position</th>
                <th className="p-3 border border-gray-300">Specialties</th>
                <th className="p-3 border border-gray-300">Experience</th>
                <th className="p-3 border border-gray-300">Hire Date</th>
                <th className="p-3 border border-gray-300">Status</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 text-center">
                    {s.employee_id}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    {s.position}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    {s.specialties}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    {s.experience_years} yrs
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    {s.hire_date}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    {s.is_active ? "Active" : "Inactive"}
                  </td>

                  <td className="p-3 border border-gray-300 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setEditStaff(s);
                          setForm({
                            full_name: "",
                            username: "",
                            email: "",
                            password: "",
                            employee_id: s.employee_id,
                            position: s.position,
                            specialties: s.specialties,
                            experience_years:
                              s.experience_years.toString(),
                            hire_date: s.hire_date,
                            is_active: s.is_active ? "true" : "false",
                          });
                        }}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setDeletingId(s.id);
                          setDeleteName(s.employee_id);
                        }}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------------
         ADD STAFF MODAL
      ---------------------------- */}
      {showAddForm && !editStaff && (
        <StaffModal
          title="Add New Staff"
          form={form}
          updateForm={updateForm}
          onCancel={() => setShowAddForm(false)}
          onSubmit={createStaff}
          showUserFields={true}
        />
      )}

      {/* ---------------------------
         EDIT STAFF MODAL
      ---------------------------- */}
      {editStaff && (
        <StaffModal
          title="Edit Staff Member"
          form={form}
          updateForm={updateForm}
          onCancel={() => setEditStaff(null)}
          onSubmit={updateExistingStaff}
          showUserFields={false}
        />
      )}

      {/* ---------------------------
         DELETE CONFIRM MODAL
      ---------------------------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 border border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-center text-red-600">
              Delete Staff Member?
            </h3>

            <p className="text-center mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteName}</span>?
            </p>

            <div className="bg-red-50 border border-red-300 p-3 rounded mb-4 text-center text-red-700">
              ⚠️ <strong>Danger Zone:</strong> This action cannot be undone.
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={deleting}
              >
                No
              </button>

              <button
                onClick={deleteStaff}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
    REUSABLE STAFF MODAL
---------------------------- */

interface StaffForm {
  full_name: string;
  username: string;
  email: string;
  password: string;
  employee_id: string;
  position: string;
  specialties: string;
  experience_years: string;
  hire_date: string;
  is_active: string;
}

interface StaffModalProps {
  title: string;
  form: StaffForm;
  updateForm: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  showUserFields: boolean;
}

function StaffModal({
  title,
  form,
  updateForm,
  onCancel,
  onSubmit,
  showUserFields,
}: StaffModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200"
      >
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        {/* USER FIELDS ONLY WHEN CREATING */}
        {showUserFields && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => updateForm("full_name", e.target.value)}
              className="border p-2 mb-3 w-full rounded"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => updateForm("username", e.target.value)}
              className="border p-2 mb-3 w-full rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              className="border p-2 mb-3 w-full rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
              className="border p-2 mb-3 w-full rounded"
              required
            />
          </>
        )}

        {/* STAFF FIELDS */}
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => updateForm("employee_id", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Position"
          value={form.position}
          onChange={(e) => updateForm("position", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Specialties"
          value={form.specialties}
          onChange={(e) => updateForm("specialties", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="number"
          placeholder="Experience (years)"
          value={form.experience_years}
          onChange={(e) => updateForm("experience_years", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="date"
          value={form.hire_date}
          onChange={(e) => updateForm("hire_date", e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <select
          value={form.is_active}
          onChange={(e) => updateForm("is_active", e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
