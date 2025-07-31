"use client";

import { useState } from "react";
import { IoLogOut } from "react-icons/io5";

export default function SidebarFooter() {
    return (
        <div className="mt-auto  border-t border-base-300 flex flex-col gap-2">
            {/* Logout */}

            {/* Theme Toggle */}
            {/* <label className="cursor-pointer flex justify-between items-center gap-2 text-sm">
                Change Theme */}
                {/* <input
          type="checkbox"
          className="toggle toggle-sm"
          onChange={() =>
            document.documentElement.setAttribute(
              "data-theme",
              document.documentElement.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark"
            )
          }
        /> */}
            {/* </label> */}
            <button
                className="btn px-5 hover:bg-blue-900 py-4 btn-sm btn-ghost justify-start"
                onClick={() => {
                    alert("Logging out...");
                }}
            >
                <span className="text-2xl mr-2"> <IoLogOut /></span> Logout
            </button>

        </div>
    );
}
