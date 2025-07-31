// components/leads/LeadFilters.jsx
import { IoSearchOutline } from "react-icons/io5";

const LeadFilters = ({
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    setSearchModalOpen,
    searchQuery, setSearchQuery,
    setCurrentPage,
    stageFilter, setStageFilter // ✅ Add this new state
}) => {
    const categories = [
        "All",
        "Digital Marketing",
        "Graphic Design",
        "Career Guideline",
        "Ethical Hacking",
        "Web Development"
    ];

    const statusOptions = [
        "NOB", "CNR", "NoF", "Join Letter", "Will Join", "Joined", "Admitted"
    ];

    const stageOptions = ["All", "Pending", "Contacted"]; 
    const AssignedRange = []

    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* Stage Filter Buttons (new) */}
            <div className="flex gap-2">
                {stageOptions.map((option) => (
                    <button
                        key={option}
                        className={`btn btn-sm ${stageFilter === option ? "bg-blue-600 text-white" : "btn-outline"}`}
                        onClick={() => {
                            setStageFilter(option);
                            setCurrentPage(1);
                        }}
                    >
                        {option}
                    </button>
                ))}
                {/* Status Dropdown */}
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-sm btn-outline capitalize">
                        {statusFilter || "Select Status"}
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                        {statusOptions.map((status) => (
                            <li key={status}>
                                <button
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                    className={`${statusFilter === status ? "font-bold text-blue-600" : ""}`}
                                >
                                    {status}
                                </button>
                            </li>
                        ))}
                        {statusFilter && (
                            <li>
                                <button
                                    onClick={() => {
                                        setStatusFilter("");
                                        setCurrentPage(1);
                                    }}
                                    className="text-error"
                                >
                                    Clear
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

            </div>


            {/* Search */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setSearchModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <IoSearchOutline className="text-lg" />
                    <span className="hidden text-sm text-white/70 md:inline">Ctrl + K</span>
                </button>
                {searchQuery && (
                    <button
                        className="btn btn-xs btn-outline"
                        onClick={() => setSearchQuery("")}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Category Buttons */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`btn btn-sm ${categoryFilter === cat ? "btn-primary bg-blue-600 text-white" : "btn-outline"}`}
                        onClick={() => {
                            setCategoryFilter(cat);
                            setCurrentPage(1);
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LeadFilters;
