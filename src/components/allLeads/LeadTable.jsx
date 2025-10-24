
import { formateDate } from "@/utils/date";
import Link from "next/link";
import { BiSolidLockAlt } from "react-icons/bi";
import { BiSolidLockOpen } from "react-icons/bi";

const LeadTable = ({
  selectedIds,
  setSelectedIds,
  leads,
  currentPage,
  leadsPerPage,
  handleCheckboxChange
}) => {





  return (
    <div className="rounded-sm  h-[calc(100vh-390px)] lg:h-[calc(100vh-160px)] overflow-scroll  border border-base-content/10 bg-base-200/10 shadow overflow-x-auto">

      {
        leads?.length == 0 ? <div className=" flex gap-2 text-center my-20 justify-center text-sm text-white/70">
          <p>No Leads Found.</p>
          <Link href={"/admin/upload"} className="text-blue-500">Clck here to upload leads</Link>
        </div> : <table className="table min-w-[1500px] lg:min-w-auto table-xs 2xl:table-sm 3xl:table-md  table-pin-rows lg:table-pin-cols table-zebra w-full">

        <thead className="text-base-content/70  text-sm uppercase tracking-wide bg-base-300">
          <tr>
            <th className="sticky pl-4 top-0 bg-base-300 z-10 px-2">
              <div className="flex  items-start gap-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm rounded-sm checkbox-primary border-blue-600 checked:bg-blue-600"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newSet = new Set(selectedIds);
                    leads.forEach((lead) => {
                      checked ? newSet.add(lead._id) : newSet.delete(lead._id);
                    });
                    setSelectedIds(newSet);
                  }}
                  checked={leads.every((lead) => selectedIds.has(lead._id))}
                />

              </div>
            </th>

           
            <th className="sticky top-0 bg-base-300 z-10">Date</th>
            <th className="sticky top-0 bg-base-300 z-10">Name</th>
            <th className="sticky top-0 bg-base-300 z-10">Email</th>
            <th className="sticky top-0 bg-base-300 z-10">Number</th>
            <th className="sticky top-0 bg-base-300 z-10">Address</th>
            <th className="sticky top-0 bg-base-300 z-10">Seminar Topic</th>
            <th className="sticky top-0 bg-base-300 z-10">Status</th>
          </tr>
        </thead>


        <tbody className="text-base-content/80 ">

          {leads.map((lead, index) => {
            const actualIndex =
              (currentPage - 1) * leadsPerPage + index;
            return (
              <tr key={actualIndex} className={`${selectedIds.has(lead._id)  ? "!bg-blue-900/50" : ""}`}>
              
                <td className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm rounded-sm checkbox-primary border-blue-600 checked:bg-blue-600"
                    checked={selectedIds.has(lead._id)}
                    onChange={(e) =>
                      handleCheckboxChange(index, lead._id, e.target.checked, e.nativeEvent.shiftKey)
                    }
                  />

                  <span className="text-xs opacity-60">
                    {actualIndex + 1}
                  </span>
                </td>

                
                <td> <span className="relative ">{lead?.isLocked && <BiSolidLockAlt title="Agent will not be able modify these lease leads" className="text-[#F7BB07] absolute -left-5 top-1/2 -translate-y-1/2"/>  } {formateDate(lead?.createdAt)}</span> </td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td > <span className="text-nowrap">{lead.phone}</span></td>
                <td className="max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis" title={lead.address} >{lead.address}</td>
                <td>
                  <span className="badge badge-neutral badge-sm">
                    {lead.seminarTopic}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge badge-sm ${lead.assignStatus
                      ? "badge-success"
                      : "badge-warning text-white text-nowrap"
                      }`}
                  >
                    {lead.assignStatus ? "Assigned" : "Not Assigned"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
      }
      
    </div>
  );
};

export default LeadTable;
