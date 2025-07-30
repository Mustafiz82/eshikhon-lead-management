// components/leads/LeadFooterControls.jsx
import Pagination from "@/shared/Pagination";

const LeadFooterControls = ({
  selectedIds,
  handleQuickSelect,
  customSelectCount,
  setCustomSelectCount,
  setIsAssignModalOpen,
  leadsPerPage,
  setLeadsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  goToPage
}) => {
  return (
    <div className="mt-4 flex flex-wrap justify-between items-center gap-4 border-t border-base-content/10 pt-4">
      {/* Assign + Quick Select */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">Selected: <b>{selectedIds.size}</b></span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">Quick Select:</span>
          {[10, 50, 100].map((count) => (
            <button
              key={count}
              className={`btn btn-xs ${selectedIds.size === count ? "btn-primary bg-blue-600" : "btn-outline"}`}
              onClick={() => handleQuickSelect(count)}
            >
              {count}
            </button>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const count = parseInt(customSelectCount);
              if (!isNaN(count) && count > 0) handleQuickSelect(count);
            }}
            className="flex items-center gap-1"
          >
            <input
              type="number"
              min="1"
              className="input focus:outline-0 border-white !rounded-none  input-xs input-bordered w-16"
              value={customSelectCount}
              onChange={(e) => setCustomSelectCount(e.target.value)}
              placeholder="Custom"
            />
          </form>
        </div>
        <button className="btn bg-blue-600 btn-sm btn-primary" onClick={() => setIsAssignModalOpen(true)}>
          Assign to
        </button>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="text-sm text-nowrap">Per page:</p>
          <select
            className="select select-sm"
            value={leadsPerPage}
            onChange={(e) => {
              setLeadsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>
    </div>
  );
};

export default LeadFooterControls;
