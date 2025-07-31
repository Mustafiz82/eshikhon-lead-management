"use client";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { leads } from "@/data/leads";
import Pagination from "@/shared/Pagination";
import { formateDate } from "@/utils/date";
import SearchModal from "@/components/allLeads/SearchModal";
import SidebarFooter from "@/shared/SidebarFooter";

const LEADS_PER_PAGE = 10;

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [stageFilter, setStageFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [searchText, setSearchText] = useState("");
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [assignedDateFilter, setAssignedDateFilter] = useState("All");
    const [followUpDateFilter, setFollowUpDateFilter] = useState("All");
    const [followUpActive, setFollowUpActive] = useState(false);

    const getDateRange = (type) => {
        const now = new Date();
        const start = new Date();

        switch (type) {
            case "Today":
                start.setHours(0, 0, 0, 0);
                break;
            case "This Week":
                start.setDate(now.getDate() - now.getDay());
                break;
            case "This Month":
                start.setDate(1);
                break;
            case "This Year":
                start.setMonth(0);
                start.setDate(1);
                break;
            case "Next 3 Days":
                return [now, new Date(now.getTime() + 3 * 86400000)];
            case "Next 7 Days":
                return [now, new Date(now.getTime() + 7 * 86400000)];
            case "Next 30 Days":
                return [now, new Date(now.getTime() + 30 * 86400000)];
            default:
                return null;
        }

        return [start, now];
    };


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

    const handleSearch = (term) => {
        setSearchQuery(term);
        setCurrentPage(1);
    };
    const filteredLeads = leads.filter((lead) => {
        const matchStatus = statusFilter ? lead.status === statusFilter : true;
        const matchCategory = categoryFilter === "All" || lead.seminarTopic === categoryFilter;
        const matchSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.number.includes(searchQuery);

        let matchAssignedDate = true;
        if (assignedDateFilter !== "All") {
            const [start, end] = getDateRange(assignedDateFilter);
            const assignedDate = new Date(lead.date);
            matchAssignedDate = assignedDate >= start && assignedDate <= end;
        }

        let matchFollowUp = true;
        if (followUpActive && followUpDateFilter !== "All" && lead.followUpDate) {
            const [start, end] = getDateRange(followUpDateFilter);
            const followDate = new Date(lead.followUpDate);
            matchFollowUp = followDate >= start && followDate <= end;
        }

        return matchStatus && matchCategory && matchSearch && matchAssignedDate && matchFollowUp;
    });

    const totalPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * LEADS_PER_PAGE,
        currentPage * LEADS_PER_PAGE
    );



    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInputFocused = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);

            // Ctrl + K → open Search Modal (unless inside input)
            if (!isInputFocused && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setSearchModalOpen(true);
            }

            // Escape → close Search Modal
            if (e.key === "Escape" && isSearchModalOpen) {
                setSearchModalOpen(false);
                setSearchText("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchModalOpen, setSearchText]);

    return (
        <div className="p-6 mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                {/* Stage Filter Buttons */}
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
                            {option} (45)
                        </button>
                    ))}

                    {/* Status Dropdown */}
                    <div className="dropdown">
                        <label
                            tabIndex={0}
                            className={`btn btn-sm capitalize ${statusFilter ? "btn-primary bg-blue-600 text-white" : "btn-outline"
                                }`}
                        >
                            Status ({statusFilter || "All"})
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                            {["All", ...statusOptions].map((status) => (
                                <li key={status}>
                                    <button
                                        onClick={() => {
                                            setStatusFilter(status === "All" ? "" : status);
                                            setCurrentPage(1);
                                        }}
                                        className={`${statusFilter === status ? "font-bold text-blue-600" : ""}`}
                                    >
                                        {status}
                                    </button>
                                </li>
                            ))}

                        </ul>
                    </div>

                    {/* Assigned Date */}
                    <div className="dropdown">
                        <label
                            tabIndex={0}
                            className={`btn btn-sm capitalize ${assignedDateFilter !== "All" ? "btn-primary bg-blue-600 text-white" : "btn-outline"
                                }`}
                        >
                            Assigned Date ({assignedDateFilter})
                        </label>

                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                            {["All", "Today", "This Week", "This Month", "This Year"].map((option) => (
                                <li key={option}>
                                    <button
                                        onClick={() => {
                                            setAssignedDateFilter(option);
                                            setCurrentPage(1);
                                        }}
                                        className={`${assignedDateFilter === option ? "font-bold text-blue-600" : ""}`}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Follow Ups Toggle */}
                    <button
                        className={`btn btn-sm ${followUpActive ? "btn-primary bg-blue-600" : "btn-outline"}`}
                        onClick={() => {
                            setFollowUpActive(!followUpActive);
                            setFollowUpDateFilter("All");
                            setCurrentPage(1);
                        }}
                    >
                        Follow Ups (12)
                    </button>

                    {/* Followed Date */}
                    {followUpActive && (
                        <div className="dropdown">
                            <label
                                tabIndex={0}
                                className={`btn btn-sm capitalize ${followUpDateFilter !== "All" ? "btn-primary bg-blue-600 text-white" : "btn-outline"
                                    }`}
                            >
                                Followed Date ({followUpDateFilter})
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-[1]">
                                {["All", "Next 3 Days", "Next 7 Days", "Next 30 Days", "This Year"].map((option) => (
                                    <li key={option}>
                                        <button
                                            onClick={() => {
                                                setFollowUpDateFilter(option);
                                                setCurrentPage(1);
                                            }}
                                            className={`${followUpDateFilter === option ? "font-bold text-blue-600" : ""}`}
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                </div>

                {/* Search */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSearchModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2"
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

            {/* Leads Table */}
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
                        {paginatedLeads.map((lead, index) => (
                            <tr
                                key={lead._id}
                                onClick={() => {
                                    setSelectedLead(lead);
                                    document.getElementById("my-drawer-4").checked = true;
                                }}
                                className="cursor-pointer hover:bg-base-300/40 transition"
                            >
                                <td>{(currentPage - 1) * LEADS_PER_PAGE + index + 1}</td>
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

            {/* Pagination */}
            <div className="flex justify-between mt-6">
                <p className="text-sm">Showing 1–10 of 45 results
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
                <SidebarFooter />


            </div>

            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                searchText={searchText}
                setSearchText={setSearchText}
                onSearch={handleSearch}
                results={leads}
                setCurrentPage={setCurrentPage}
            />




        </div>
    );
};

export default Page;
