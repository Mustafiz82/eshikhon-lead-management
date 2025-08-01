const Dropdown = (
    {
        dropdownPosition = "" , 
        selectedState = "All" , 
        setSelectedState = "" ,
        label = "", 
        options = [] , 
        setCurrentPage ,
        defaultOptions
        
    }
) => {
    return <div>

        <div className={`dropdown ${dropdownPosition}`}>
            <label
                tabIndex={0}
                className={`btn btn-sm capitalize ${selectedState !== (defaultOptions || "All") ? "btn-primary bg-blue-600 text-white" : "btn-outline"
                    }`}
            >
                {label} ({selectedState})
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 "
            >
                {options.map((item) => (
                    <li key={item}>
                        <button
                            onClick={() => {
                                setSelectedState(item);
                                setCurrentPage(1);
                            }}
                            className={`${selectedState === item ? "font-bold text-blue-600" : ""}`}
                        >
                            {item}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
};

export default Dropdown;