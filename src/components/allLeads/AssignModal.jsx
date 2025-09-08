"use client";
import axiosPublic from "@/api/axios";
import useFetch from "@/hooks/useFetch";
import Modal from "@/shared/Modal";
import React from "react";
import Swal from "sweetalert2";

const AssignModal = ({
  isOpen,
  onClose,
  selectedIds,
  setIsAssignModalOpen,
  setSelectedIds
  // onAssign,
}) => {

  const { data, loading } = useFetch("/user")
  const agents = data.filter(item => item?.name !== "Admin")

  console.log(agents)


  const handleAssign = async (email) => {
    const ids = [...selectedIds];

    if (!(ids?.length > 0)) {
      return Swal.fire({
        icon: "warning",
        title: "No leads selected",
        text: "Please select at least one lead before assigning.",
      });
    }

    console.log(email, ids);

    try {
      const res = await axiosPublic.patch("/leads", {
        ids,
        update: {
          assignTo: email,
          assignStatus: true,
          assignDate : Date.now()
        },
      });

      Swal.fire({
        icon: "success",
        title: "Assigned Successfully",
        text: `${res.data.modified || ids.length} lead(s) assigned to ${email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setIsAssignModalOpen(false)
      setSelectedIds(new Set ())


      // Optional: clear selection or refetch leads here
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error.response?.data?.error || error.message,
      });
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign to Agent" size="max-w-4xl">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-sm text-base-content/70">
              <th>Agent Name</th>
              <th>Assigned Leads</th>
              <th>Pending Leads</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, idx) => (
              <tr key={idx} className="hover:bg-base-200/50">
                <td className="font-medium">{agent.name}</td>
                <td>{agent.leadCount}</td>
                <td>{agent.naLeadCount}</td>
                <td>
                  <button
                    className="btn btn-sm bg-blue-600 btn-primary"
                    onClick={() => handleAssign(agent?.email)}
                  >
                    Assign
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
