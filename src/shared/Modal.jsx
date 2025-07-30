"use client";
import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "max-w-xl", // can be max-w-md, max-w-4xl etc.
  noHeader = false,
  noPadding = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`bg-base-100 text-base-content rounded-xl shadow-xl w-[90%] ${size} border border-base-300 ${
          noPadding ? "" : "p-4"
        }`}
      >
        {!noHeader && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              className="btn btn-sm btn-ghost"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
