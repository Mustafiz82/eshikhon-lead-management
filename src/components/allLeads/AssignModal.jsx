"use client";
import useFetch from "@/hooks/useFetch";
import Modal from "@/shared/Modal";
import React from "react";

const AssignModal = ({
  isOpen,
  onClose,
  selectedCount,
  onAssign,
}) => {

  const {data , loading } = useFetch("/user")
  const agents = data.filter(item => item?.name !== "Admin")
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign to Agent" size="max-w-4xl">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-sm text-base-content/70">
              <th>Agent Name</th>
              <th>Pending Leads</th>
              <th>Assigned Leads</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, idx) => (
              <tr key={idx} className="hover:bg-base-200/50">
                <td className="font-medium">{agent.name}</td>
                <td>{agent.pendingLeads}</td>
                <td>{agent.assignedLeads}</td>
                <td>
                  <button
                    className="btn btn-sm bg-blue-600 btn-primary"
                    onClick={() => onAssign(agent)}
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
        Selected Leads: <b>{selectedCount}</b>
      </div>
    </Modal>
  );
};

export default AssignModal;
