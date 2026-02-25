"use client";

import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import axiosPublic from "@/api/axios";
import { showAlert } from "@/utils/swal";

const UpdatePaymentInfoModal = ({ handleClose }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    accountDetails: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch current saved payment info
  const { data: paymentInfo, loading: fetchLoading } = useFetch(
    user?.email ? `/user/${user.email}/payment-info` : null
  );

  // ✅ Populate form when data loads
  useEffect(() => {
    if (paymentInfo) {
      setFormData({
        name: paymentInfo.name || "",
        accountNumber: paymentInfo.accountNumber || "",
        accountDetails: paymentInfo.accountDetails || "",
      });
    }
  }, [paymentInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.accountNumber || !formData.accountDetails) {
      showAlert("Error", "All fields are required", "error");
      return;
    }

    setLoading(true);

    try {
      await axiosPublic.put(
        `/user/${user.email}/payment-info`,
        {
          name: formData.name,
          accountNumber: formData.accountNumber,
          accountDetails: formData.accountDetails,
          changedBy: user.email,
        }
      );

      showAlert("Success", "Payment info updated successfully", "success");
      handleClose();
    } catch (err) {
      showAlert(
        "Error",
        err?.response?.data?.error || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] w-full max-w-md rounded-xl shadow-xl border border-slate-700 p-6 relative">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold text-white mb-6">
          Update Payment Information
        </h2>

        {fetchLoading ? (
          <div className="text-center text-slate-400 py-6">
            Loading...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            {/* Account Details */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Account Details (Payment Method)
              </label>
              <input
                type="text"
                name="accountDetails"
                value={formData.accountDetails}
                onChange={handleChange}
                placeholder="bKash / Bank / Nagad"
                required
                className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePaymentInfoModal;