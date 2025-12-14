"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { showToast } from "@/components/Toast";

import {
  getUsers,
  createUser,
  type UserListResponse,
  type UserCreateRequest,
} from "@/services/customersService";

import {
  CustomersFilters,
  CustomersTable,
  CustomerModal,
} from "./CustomersManagement";

interface Filters {
  userType: string;
  search: string;
}

export default function CustomersManagementTab() {
  const [loading, setLoading] = useState(true);
  const [customersList, setCustomersList] =
    useState<UserListResponse[]>([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  });

  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // default 5

  const [filters, setFilters] = useState<Filters>({
    userType: "",
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUsers(page, limit);
      setCustomersList(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCustomers = customersList.filter((c) => {
    const q = filters.search.toLowerCase();
    const matchesSearch =
      c.username.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.full_name?.toLowerCase().includes(q) ?? false);

    const matchesType =
      !filters.userType || c.user_type === filters.userType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <User size={28} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Customers & Users
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage customer accounts and access roles
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* FILTER BAR (NOW includes Show Entries) */}
      <CustomersFilters
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={loadData}
        loading={loading}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <CustomersTable
        customers={filteredCustomers}
        page={page}
        pagination={pagination}
        onPageChange={setPage}
        loading={loading}
      />

      {/* MODAL */}
      {isModalOpen && (
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            await createUser(data);
            loadData();
          }}
          submitting={submitting}
        />
      )}
    </div>
  );
}
