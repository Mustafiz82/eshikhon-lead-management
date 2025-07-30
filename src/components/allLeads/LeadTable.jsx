
import { formateDate } from "@/utils/date";

const LeadTable = ({
  paginatedLeads,
  selectedIds,
  setSelectedIds,
  handleCheckboxChange,
  activeRowIndex
}) => {
  return (
    <div className="rounded-sm h-[calc(100vh-160px)] overflow-scroll border border-base-content/10 bg-base-200/10 shadow overflow-x-auto">
      <table className="table table-pin-rows table-pin-cols table-zebra w-full">
        <thead className="text-base-content/70 text-sm uppercase tracking-wide bg-base-300">
          <tr>
            <th className="sticky pl-4 top-0  z-10 px-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm rounded-sm checkbox-primary checked:bg-blue-600 border-blue-600"
                onChange={(e) => {
                  const checked = e.target.checked;
                  const newSet = new Set(selectedIds);
                  paginatedLeads.forEach((lead) =>
                    checked ? newSet.add(lead._id) : newSet.delete(lead._id)
                  );
                  setSelectedIds(newSet);
                }}
                checked={paginatedLeads.every((lead) => selectedIds.has(lead._id))}
              />
            </th>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Address</th>
            <th>Seminar Topic</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-base-content/80">
          {paginatedLeads.map((lead, index) => {
            const actualIndex = index;
            return (
              <tr key={lead._id} className={activeRowIndex === index ? "bg-blue-100 dark:!bg-blue-900/50" : ""}>
                <td className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm rounded-sm checkbox-primary checked:bg-blue-600 border-blue-600"
                    onChange={(e) => handleCheckboxChange(lead._id, e.target.checked)}
                    checked={selectedIds.has(lead._id)}
                  />
                  <span className="text-xs opacity-60">{actualIndex + 1}</span>
                </td>
                <td>{formateDate(lead.date)}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.number}</td>
                <td>{lead.address}</td>
                <td>
                  <span className="badge badge-neutral badge-sm">{lead.seminarTopic}</span>
                </td>
                <td>
                  <span className={`badge badge-sm ${lead.status === "Assigned" ? "badge-success" : "badge-warning text-white"}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
