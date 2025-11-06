import { useState } from "react";

const Dropdown = ({
    dropdownPosition = "",
    selectedState = "All",
    setSelectedState = () => { },
    label = "",
    options = [],
    setCurrentPage = () => { },
    defaultOptions,
    showDatePicker = false
}) => {


    const handleSelect = (val) => {
        setSelectedState(val);
        setCurrentPage(1);
    };



    return (
        <div className="flex z-[9999] flex-1 lg:flex-auto items-center gap-3">
            <div className={`dropdown  text-xs bg-gray-800 flex-1 lg:flex-auto ${dropdownPosition}`}>
                <button
                    type="button"

                    className={`btn  btn-sm text-[10px] 3xl:text-[12px] w-full capitalize ${selectedState !== (defaultOptions || "All")
                        ? "btn-blue-600 bg-blue-600 text-white"
                        : "btn-outline"
                        }`}
                >
                    {label} ({selectedState})
                </button>

                <ul
                    className="dropdown-content  menu p-2 shadow bg-gray-800 rounded-box  !w-64 "
                    // prevent closing when interacting inside
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="max-h-[800px] overflow-y-auto" >
                        {options.map((item ,idx) => (
                            <li key={idx}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className={selectedState === item ? "font-bold text-blue-600" : ""}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                        {
                            showDatePicker && <>
                                {/* optional divider/title */}
                                <li className="menu-title mt-1">
                                    <span className="opacity-70">Pick a date</span>
                                </li>

                                <li className="px-2 py-1">
                                    <input
                                        type="date"
                                        className="date-input input input-sm w-full bg-gray-700 text-base-content border-base-300
                         focus:outline-none focus:ring-0 focus:border-blue-600"
                                        value={/^\d{4}-\d{2}-\d{2}$/.test(selectedState) ? selectedState : ""}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        onChange={(e) => handleSelect(e.target.value)}
                                    />
                                </li>

                            </>
                        }
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Dropdown;
