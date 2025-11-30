import { useState } from "react";

const Dropdown = ({
    dropdownPosition = "",
    selectedState = "All",
    setSelectedState = () => { },
    label = "",
    options = [],
    setCurrentPage = () => { },
    defaultOptions,
    showDatePicker = false,
    showSearch = false // 1. Add new prop
}) => {

    // 2. State for search query
    const [searchTerm, setSearchTerm] = useState("");

    const handleSelect = (val) => {
        setSelectedState(val);
        setCurrentPage(1);
        // Optional: Clear search on select if desired
        // setSearchTerm(""); 
    };

    // 3. Filter options based on search term (if showSearch is true)
    const filteredOptions = showSearch
        ? options.filter((item) =>
            item.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    return (
        <div className="flex flex-1 lg:flex-auto items-center gap-3">
            <div className={`dropdown text-xs bg-gray-800 flex-1 lg:flex-auto ${dropdownPosition}`}>
                <button
                    type="button"
                    className={`btn btn-sm text-[10px] 3xl:text-[12px] w-full capitalize ${selectedState !== (defaultOptions || "All")
                        ? "btn-blue-600 bg-blue-600 text-white"
                        : "btn-outline"
                        }`}
                >
                    {label} ({selectedState})
                </button>

                <ul
                    className="dropdown-content z-[9990] menu p-2 shadow bg-gray-800 rounded-box !w-64"
                    // prevent closing when interacting inside
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 4. Render Search Input if enabled */}
                    {showSearch && (
                        <div className=" pb-2 mb-2 border-b border-gray-700">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input input-sm w-full bg-gray-700 text-white focus:outline-none focus:border-blue-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                // Stop propagation to prevent dropdown close on click
                                onClick={(e) => e.stopPropagation()} 
                            />
                        </div>
                    )}

                    <div className="max-h-[800px] overflow-y-auto">
                        {/* 5. Map through filteredOptions instead of options */}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((item, idx) => (
                                <li key={idx}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(item)}
                                        className={selectedState === item ? "font-bold text-blue-600" : ""}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 text-center py-2">No results found</li>
                        )}

                        {showDatePicker && (
                            <>
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
                        )}
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Dropdown;