import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaChevronDown } from "react-icons/fa6";

export default function DateRangeComponent({state, setState}) {
    const [showDateRange, setShowDateRange] = useState(false);


    const dateRangeRef = useRef(null);   // dropdown container
    const buttonRef = useRef(null);      // button element

    const formatDate = (date) => {
        if (!date) return "Select a date";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleSelect = (ranges) => {
        setState([ranges.selection]);
    };

    // Outside click handler — FIXED
    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsidePicker =
                dateRangeRef.current &&
                dateRangeRef.current.contains(event.target);

            const clickedButton =
                buttonRef.current &&
                buttonRef.current.contains(event.target);

            if (!clickedInsidePicker && !clickedButton) {
                setShowDateRange(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedStartDate = state[0].startDate;
    const selectedEndDate = state[0].endDate;

    return (
        <div className="relative inline-block font-sans">
            <button
                ref={buttonRef}
                className="flex items-center justify-between 
                min-w-[250px] px-3 py-2 
                bg-[#0f172a] border border-[#1e293b] 
                rounded-md cursor-pointer 
                text-sm text-gray-200 
                hover:border-blue-500 transition"
                onClick={() => setShowDateRange(!showDateRange)}
            >
                {selectedStartDate && selectedEndDate ? (
                    <>
                        {formatDate(selectedStartDate)} - {formatDate(selectedEndDate)}
                    </>
                ) : (
                    "Select Date Range"
                )}

                <FaChevronDown
                    className={
                        showDateRange
                            ? "rotate-180 duration-300"
                            : "rotate-0 duration-300"
                    }
                />
            </button>

            {showDateRange && (
                <div
                    ref={dateRangeRef}
                    className="absolute top-full right-0 z-10 mt-3 
                    shadow-lg rounded-lg overflow-hidden"
                >
                    <DateRangePicker
                        ranges={state}
                        onChange={handleSelect}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        direction="horizontal"
                        className="react-date-range-custom-styles"
                    />
                </div>
            )}
        </div>
    );
}
