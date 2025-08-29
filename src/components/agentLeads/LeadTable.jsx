import { formateDate } from "@/utils/date";

const LeadTable = ({leads , setSelectedLead , currentPage}) => {

    let leadsPerPage = 10
    return <div>
        <div className="rounded-sm h-[calc(100vh-160px)] overflow-scroll border border-base-content/10 bg-base-200/10 shadow overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr className="bg-base-200">
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Seminar Topic</th>
                        <th>Status</th>
                        <th>Assigned At</th>
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
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.number}</td>
                            <td>{lead.address}</td>
                            <td>{lead.seminarTopic}</td>
                            <td>
                                <span
                                    className={`badge ${lead.status === "Interested"
                                        ? "badge-success"
                                        : lead.status === "Contacted"
                                            ? "badge-info"
                                            : "badge-warning"
                                        }`}
                                >
                                    {lead.status}
                                </span>
                            </td>
                            <td>{formateDate(lead.date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
};

export default LeadTable;