"use client";
import Modal from "@/shared/Modal";
import React from "react";

const SearchModal = ({
  isOpen,
  onClose,
  searchText,
  setSearchText,
  results,
  setCurrentPage,
  setSearchQuery,
}) => {





  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Leads">
      <form onSubmit={(e) => {
        e.preventDefault()
        setSearchQuery(searchText)
        onClose()
      }}>
        <input
          type="text"
          placeholder="Search by name, email, number..."
          className="input input-bordered focus:outline-0 focus:border-blue-600 w-full mb-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
        />
      </form>

      <div className="h-[300px]  overflow-y-auto space-y-2">
        {results.slice(0, 10).map((lead) => (
          <div
            key={lead._id}
            onClick={() => {
              setCurrentPage(1);
              setSearchQuery(lead?.phone)
              onClose();
            }}
            className="p-2 border border-base-300 rounded hover:bg-base-200 cursor-pointer transition-colors"
          >
            <div className="font-semibold">{lead.name}</div>
            <div className="text-sm opacity-70">{lead.email} • {lead.number}</div>
          </div>
        ))}

        {searchText && results.length === 0 && (
          <p className="text-center mt-16 text-sm text-base-content/60">
            No results found.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
