"use client";
import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const renderButtons = () => {
    const buttons = [];

    const pushPage = (page) => {
      buttons.push(
        <button
          key={page}
          className={`join-item btn btn-sm ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      );
    };

    const pushDots = (key) => {
      buttons.push(
        <button key={key} className="join-item btn btn-sm btn-disabled">
          ...
        </button>
      );
    };

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pushPage(i);
    } else {
      const lastPage = totalPages;

      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pushPage(i);
        pushDots("dots-mid");
        for (let i = lastPage - 2; i <= lastPage; i++) pushPage(i);
      } else if (currentPage === 4) {
        pushPage(1);
        pushPage(2);
        pushDots("dots-left");
        pushPage(4);
        pushPage(5);
        pushPage(6);
        pushDots("dots-right");
        pushPage(lastPage);
      } else if (currentPage > 4 && currentPage < lastPage - 2) {
        pushPage(1);
        pushDots("dots-left");
        pushPage(currentPage - 1);
        pushPage(currentPage);
        pushPage(currentPage + 1);
        pushDots("dots-right");
        pushPage(lastPage);
      } else {
        pushPage(1);
        pushDots("dots-left");
        for (let i = lastPage - 4; i <= lastPage; i++) {
          if (i >= 1) pushPage(i);
        }
      }
    }

    return buttons;
  };

  return (
    <div className={`join ${className}`}>
      <button
        className="join-item bg-blue-600 btn btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      {renderButtons()}
      <button
        className="join-item bg-blue-600 btn btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
