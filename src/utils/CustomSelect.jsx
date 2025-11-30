import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ selected, setSelected , options , bgColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    
    const handleSelect = (value) => {
        setSelected(value);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options?.find((option) => option.value === selected);

    console.log(selected)

    return (
        <div className="relative !z-[9999] w-full" ref={selectRef}>
            <div
                className={` ${bgColor ? "py-5 bg-gray-900": "bg-gray-800 py-2" } select  stasticsSelect min-w-[150px] lg:min-w-xs cursor-pointer input-bordered w-full focus:outline-0 hover:border-blue-600 select-sm  text-gray-200 border border-gray-700 rounded-md flex items-center justify-between px-3 `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : "Select..."}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </div>
            {isOpen && (
                <ul className="absolute text-xs !z-[9999] w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    {options?.map((option) => (
                        <li
                            key={option.value}
                            className={`p-2  cursor-pointer hover:bg-blue-600/50 ${
                                selected === option.value ? "bg-blue-600" : ""
                            }`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;