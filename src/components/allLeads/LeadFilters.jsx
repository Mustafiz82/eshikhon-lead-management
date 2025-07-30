// components/leads/LeadFilters.jsx
import { IoSearchOutline } from "react-icons/io5";

const LeadFilters = ({
  statusFilter, setStatusFilter,
  categoryFilter, setCategoryFilter,
  setSearchModalOpen,
  searchQuery, setSearchQuery,
  setCurrentPage
}) => {
  const categories = [
    "All",
    "Digital Marketing",
    "Graphic Design",
    "Career Guideline",
    "Ethical Hacking",
    "Web Development"
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
      {/* Status */}
      <div className="flex gap-2">
        {["All", "Assigned", "Not Assigned"].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? "btn-primary bg-blue-600 text-white" : "btn-outline"}`}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1);
            }}
          >
            {status}
          </button>
        ))}
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
          <button className="btn btn-xs btn-outline" onClick={() => setSearchQuery("")}>
            Clear
          </button>
        )}
      </div>

      {/* Category */}
      <div className="flex gap-2">
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
