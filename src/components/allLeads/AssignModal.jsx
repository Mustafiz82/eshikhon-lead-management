"use client";
import axiosPublic from "@/api/axios";
import useFetch from "@/hooks/useFetch";
import Modal from "@/shared/Modal";
import { showAlert, showToast } from "@/utils/swal";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AssignModal = ({
  isOpen,
  onClose,
  selectedIds,
  setIsAssignModalOpen,
  setSelectedIds,
  refetch
  // onAssign,
}) => {

  const currentMonth = new Date().getMonth() + 1;
  const { data, loading, refetch: agentDatarefetch } = useFetch(`/user?month=${currentMonth}&year=2025`)
  const agents = data.filter(item => item?.name !== "Admin")
  const [assigningEmail, setAssingingEmail] = useState("")

  console.log(agents)


  const handleAssign = async (email) => {
    setAssingingEmail(email)
    const ids = [...selectedIds];

    if (!(ids?.length > 0)) {
      return showAlert(
        "No leads selected",
        "Please select at least one lead before assigning.",
        "warning"
      );
    }

    console.log(email, ids);

    try {
      const res = await axiosPublic.patch("/leads", {
        ids,
        update: {
          assignTo: email,
          assignStatus: true,
          assignDate: Date.now()
        },
      });

      showAlert(
        "Assigned",
        `${res.data.modified || ids.length} lead(s) assigned to ${email}`,
        "success"
      );
      agentDatarefetch()  


      setIsAssignModalOpen(false)
      setSelectedIds(new Set())
      setAssingingEmail("")
      refetch()


      // Optional: clear selection or refetch leads here
    } catch (error) {
      // on error
      showAlert(
        "Assignment Failed",
        error.response?.data?.error || error.message,
        "error"
      );
      setAssingingEmail("")
    }
  };





  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign to Agent" size="max-w-lg">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-sm text-base-content/70">
              <th>Agent Name</th>
             
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, idx) => (
              <tr key={idx} className="hover:bg-base-200/50">
                <td className="font-medium">{agent?.name}</td>

                <td>
                  <button
                    disabled={assigningEmail == agent?.email}
                    className="btn w-[90px] disabled:to-blue-600/20 btn-sm bg-blue-600 btn-primary"
                    onClick={() => handleAssign(agent?.email)}
                  >
                    {(assigningEmail == agent?.email) ? "Assigning..." : "Assign"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-right text-base-content/60">
        Selected Leads: <b>{selectedIds.size}</b>
      </div>
    </Modal>
  );
};

export default AssignModal;
