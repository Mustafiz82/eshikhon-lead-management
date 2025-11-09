import { formateDate } from "@/utils/date";
import { BiSolidLockAlt } from "react-icons/bi";

const LeadTable = ({ leads, setSelectedLead, currentPage , leadsPerPage , followUpActive , missedFUActive}) => {

    
    const statusColors = {
        "Enrolled": "badge-success",          // ✅ Green → positive, confirmed
        "Will Join on Seminar": "badge-primary", // 🔵 Strong intent, upcoming
        "Not Interested": "badge-error",      // 🔴 Rejected, negative
        "Enrolled in Other Institute": "badge-secondary", // 🌸 Pink → sidelined/alternative
        "Call declined": "badge-error",        // 🔴 Abrupt stop
        "Call later": "badge-primary",        // 🔴 Abrupt stop
        "Call Not Received": "badge-warning", // 🟨 Needs caution/attention
        "Number Off or Busy": "badge-neutral", // ⚫ Inactive/unavailable
        "Wrong Number": "badge-error",        // 🔴 Mistake
        "Pending": "badge-info",              // 🟦 Neutral wait / requires follow-up
    };


    return <div>
        <div className="rounded-sm h-[calc(100vh-260px)]  lg:h-[calc(100vh-160px)] overflow-scroll border border-base-content/10 bg-base-200/10 shadow overflow-x-auto">
            <table className="table table-xs 2xl:table-sm table-zebra table-pin-rows w-full">
                <thead>
                    <tr className="bg-base-200">
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Intersted Course</th>
                        <th>Intersted Seminar</th>
                        <th>Type</th>
                        <th>Lead Source</th>
                        <th>Status</th>
                        <th>{followUpActive ||  missedFUActive  ? "Follow Up Date" : "Assigned At" }</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead, index) => (
                        <tr
                            key={lead._id}
                            onClick={() => {
                                setSelectedLead(lead);

                            }}
                            className="cursor-pointer hover:bg-base-300/40 transition"
                        >
                            <td>{(currentPage - 1) * leadsPerPage + index + 1}</td>
                            <td> <span className="relative ">{lead?.isLocked && <BiSolidLockAlt title="Lead is Locked . Contact Admin to modify the leads" className="text-[#F7BB07] absolute -left-5 top-1/2 -translate-y-1/2"/>  } {lead.name}</span> </td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td className="max-w-[250px] whitespace-normal break-words">{lead.address}</td>
                            <td>{lead.interstedCourse}</td>
                            <td>{lead.interstedSeminar}</td>
                            <td>{lead.interstedCourseType}</td>
                            <td>{lead.leadSource}</td>
                            <td>
                                <span
                                    className={`badge badge-sm text-white text-nowrap ${statusColors[lead.leadStatus] || "badge-neutral"
                                        }`  }
                                >
                                    {lead.leadStatus}
                                </span>
                            </td>


                            <td>{formateDate(followUpActive ||  missedFUActive  ? lead?.followUpDate : lead?.assignDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
};

export default LeadTable;