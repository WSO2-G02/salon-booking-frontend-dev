"use client";

import { useEffect, useState } from "react";
import { servicesApiFetch } from "@/lib/servicesApi";
import { Plus, Scissors, Edit2, Trash2 } from "lucide-react";
import { showToast } from "@/components/Toast";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration_minutes: number;
}

export default function ServicesManagementSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration_minutes: "",
  });

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // -------------------------------------------------
  // LOAD SERVICES
  // -------------------------------------------------
  async function loadServices() {
    setLoading(true);

    try {
      const res = await servicesApiFetch("/services", { method: "GET" });
      const data = await res.json();
      setServices(data);
    } catch (e) {
      console.error("Failed to load services");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  // -------------------------------------------------
  // CREATE SERVICE
  // -------------------------------------------------
  async function createService(e: any) {
    e.preventDefault();

    try {
      await servicesApiFetch("/services", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          duration_minutes: Number(form.duration_minutes),
        }),
      });

      showToast("Service created!", "success");

      setShowAddForm(false);
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        duration_minutes: "",
      });

      await loadServices();
    } catch (e) {
      showToast("Failed to create service", "error");
    }
  }

  // -------------------------------------------------
  // UPDATE SERVICE
  // -------------------------------------------------
  async function updateExistingService(e: any) {
    e.preventDefault();
    if (!editService) return;

    try {
      await servicesApiFetch(`/services/${editService.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          duration_minutes: Number(form.duration_minutes),
        }),
      });

      showToast("Service updated!", "success");

      setEditService(null);
      await loadServices();
    } catch (e) {
      showToast("Update failed", "error");
    }
  }

  // -------------------------------------------------
  // DELETE SERVICE WITH MODAL
  // -------------------------------------------------
  async function confirmDelete() {
    if (!deleteId) return;

    setDeleting(true);

    try {
      // Remove from UI immediately
      setServices((prev) => prev.filter((s) => s.id !== deleteId));

      const res = await servicesApiFetch(`/services/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      showToast("Service deleted", "success");

      setDeleteId(null);

      await loadServices();
    } catch (e) {
      showToast("Failed to delete service", "error");
    }

    setDeleting(false);
  }

  // -------------------------------------------------
  // FRONTEND UI
  // -------------------------------------------------
  return (
    <div className="p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Scissors className="text-red-500" /> Services Management
      </h2>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer bg-red-500 text-white p-6 rounded-xl shadow hover:bg-red-600 transition"
        >
          <div className="flex items-center gap-3">
            <Plus size={28} />
            <h3 className="text-xl font-semibold">Add New Service</h3>
          </div>
          <p className="text-sm mt-2">Create a new salon service</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Total Services</h3>
          <p className="text-3xl font-bold mt-2">{services.length}</p>
        </div>
      </div>

      {/* TABLE */}
      <h3 className="text-xl font-bold mb-4">All Services</h3>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Duration</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="text-center text-sm">
                  <td className="p-3 border font-semibold">{s.name}</td>
                  <td className="p-3 border">{s.description}</td>
                  <td className="p-3 border">{s.category}</td>
                  <td className="p-3 border">Rs. {s.price}</td>
                  <td className="p-3 border">{s.duration_minutes} min</td>

                  <td className="p-3 border flex gap-3 justify-center">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setEditService(s);
                        setForm({
                          name: s.name,
                          description: s.description,
                          category: s.category,
                          price: s.price.toString(),
                          duration_minutes: s.duration_minutes.toString(),
                        });
                      }}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddForm && (
        <Modal title="Add Service" onCancel={() => setShowAddForm(false)} onSubmit={createService}>
          {["name", "description", "category", "price", "duration_minutes"].map((field) => (
            <input
              key={field}
              type={field === "price" || field === "duration_minutes" ? "number" : "text"}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={(form as any)[field]}
              onChange={(e) => updateForm(field, e.target.value)}
              className="border p-2 mb-3 w-full rounded"
              required
            />
          ))}
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editService && (
        <Modal title="Edit Service" onCancel={() => setEditService(null)} onSubmit={updateExistingService}>
          {["name", "description", "category", "price", "duration_minutes"].map((field) => (
            <input
              key={field}
              type={field === "price" || field === "duration_minutes" ? "number" : "text"}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={(form as any)[field]}
              onChange={(e) => updateForm(field, e.target.value)}
              className="border p-2 mb-3 w-full rounded"
              required
            />
          ))}
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteId !== null && (
        <DeleteModal
          deleting={deleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------
   SHARED MODALS
------------------------------------------------- */

function Modal({ title, children, onCancel, onSubmit }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        {children}

        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteModal({ deleting, onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
        <p className="text-sm mb-6">Are you sure you want to delete this service?</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            No
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className={`px-4 py-2 text-white rounded ${
              deleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
