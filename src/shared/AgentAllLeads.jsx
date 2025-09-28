"use client";
import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
// import { leads } from "@/data/leads";
import Pagination from "@/shared/Pagination";
import SearchModal from "@/components/allLeads/SearchModal";
import Dropdown from "@/components/agentLeads/Dropdown";
import LeadModals from "@/components/agentLeads/LeadModals";
import LeadTable from "@/components/agentLeads/LeadTable";
import useFetch from "@/hooks/useFetch";
import { AuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";


const AgentAllLeads = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage, setLeadsPerPage] = useState(50)

    console.log(leadsPerPage)

    const [searchText, setSearchText] = useState(""); // for onchange
    const [searchQuery, setSearchQuery] = useState("");  // when press inter buton to show on table

    const [selectedSeminar, setSelectedSeminar] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedAssingedDate, setSelectedAssignedDate] = useState("All")
    const [selectedSortMethod, setSelectedSortMethod] = useState("Default")
    const [selectedStage, setSelectedStage] = useState("All")


    const [followUpActive, setFollowUpActive] = useState(false);
    const [selectedFollowedDate, setSelectedFollowedpDate] = useState("All")
    const [missedFUActive, setMissedFUActive] = useState(false);

    const [includeGlobalSearch, setIncludeGlobalSearch] = useState(false)

    const { user } = useContext(AuthContext)
    const { email } = useParams();
    const decodedEmail = email ? decodeURIComponent(email) : user?.email;

    console.log(decodedEmail, "decoded email");





    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    console.log(user.email, "user email");
    const params = new URLSearchParams({
        currentPage: currentPage,
        limit: leadsPerPage,
        search: searchQuery.trim(),
        course: selectedSeminar,
        leadStatus: selectedStatus,
        stage: selectedStage,
        assignDate: selectedAssingedDate,
        assignTo: !includeGlobalSearch ? (decodedEmail ? decodedEmail : user.email) : null,
        sort: selectedSortMethod,
        showOnlyFollowups: followUpActive,
        followUpDate: selectedFollowedDate,
        showOnlyMissedFollowUps: missedFUActive,

    })


    const { data: leadsCount, refetch: paginateRefetch } = useFetch(`/leads/count?${params}`)
    const { data: leads, refetch } = useFetch(`/leads?${params}`)
    const { data: course } = useFetch("/course")



    const statusOptions = [
        "All",
        "Pending",
        "Enrolled",
        "Joined on seminar",
        "Will Join on Seminar",
        "Not Interested",
        "Enrolled in Other Institute",
        "Cut the Call",
        "Call Not Received",
        "Number Off or Busy",
        "Wrong Number"
    ]
    const assignedDateOptions = ["All", "Today", "This Week", "This Month", "This Year"]
    const followedOptions = ["All", "Next 3 Days", "Next 7 Days", "Next 30 Days", "This Year"]
    const stageOptions = ["All", "Pending", "Contacted"];
    const totalPages = Math.round((leadsCount?.count / leadsPerPage)) || 1



    const leadCountStart = (currentPage - 1) * leadsPerPage
    const expactedEnd = leadCountStart + leadsPerPage - 1
    const leadCountEnd = leadsCount?.count > expactedEnd ? expactedEnd : leadsCount?.count

    const handleSearch = (term) => {
        setSearchQuery(term);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

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



    useEffect(() => {
        const timeOut = setTimeout(() => {
            setSearchQuery(searchText)
        }, 400);

        return () => clearTimeout(timeOut)
    }, [searchText])



    useEffect(() => {
        refetch()
        paginateRefetch()
    }, [
        currentPage,
        leadsPerPage,
        searchQuery,
        selectedSeminar,
        selectedSortMethod,
        selectedStatus,
        selectedStage,
        selectedAssingedDate,
        selectedFollowedDate,
        followUpActive,
        missedFUActive,
        user,
        includeGlobalSearch
    ])



    return (
        <div className="p-6 mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                {/*filter by stage */}
                <div className="flex gap-2">
                    {stageOptions.map((option) => (
                        <button
                            key={option}
                            className={`btn btn-sm ${selectedStage === option ? "bg-blue-600 text-white" : "btn-outline"}`}
                            onClick={() => {
                                setSelectedStage(option);
                                setCurrentPage(1);
                            }}
                        >
                            {option} (45)
                        </button>
                    ))}

                    {/* Sort By Dropdown */}
                    <Dropdown
                        dropdownPosition="dropdown-end"
                        selectedState={selectedSortMethod}
                        setSelectedState={setSelectedSortMethod}
                        label="Sort By"
                        options={["Default", "Ascending", "Descending"]}
                        setCurrentPage={setCurrentPage}
                        defaultOptions={"Default"}
                    />
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
                            onClick={() => {
                                setSearchQuery("")
                                setIncludeGlobalSearch(false)
                            }

                            }
                        >
                            Clear
                        </button>
                    )}
                </div>




                <div className="flex flex-wrap justify-between items-center gap-4 ">


                    {/* filter by Seminar topic*/}
                    <Dropdown
                        dropdownPosition="dropdown-end"
                        selectedState={selectedSeminar}
                        setSelectedState={setSelectedSeminar}
                        label="Seminar Topic"
                        options={["All", ...course.map(item => item.name)]}
                        setCurrentPage={setCurrentPage}

                    />

                    {/* filter by Status */}
                    <Dropdown
                        dropdownPosition=""
                        selectedState={selectedStatus}
                        setSelectedState={setSelectedStatus}
                        label="Status"
                        options={statusOptions}
                        setCurrentPage={setCurrentPage}

                    />

                    {/* Filter by Assigned Date  */}
                    <Dropdown
                        dropdownPosition=""
                        selectedState={selectedAssingedDate}
                        setSelectedState={setSelectedAssignedDate}
                        label="Assigned Date"
                        options={assignedDateOptions}
                        setCurrentPage={setCurrentPage}
                        showDatePicker

                    />

                    {/* Follow Ups Toggle */}
                    <button
                        className={`btn btn-sm ${followUpActive ? "btn-primary bg-blue-600" : "btn-outline"}`}
                        onClick={() => {
                            setFollowUpActive(!followUpActive);
                            setSelectedFollowedpDate("All");
                            setCurrentPage(1);
                        }}
                    >
                        Follow Ups (12)
                    </button>

                    {/* Filter by Followed Date */}
                    {followUpActive && (

                        <Dropdown
                            dropdownPosition="dropdown-end"
                            selectedState={selectedFollowedDate}
                            setSelectedState={setSelectedFollowedpDate}
                            label="Followed Date"
                            options={followedOptions}
                            setCurrentPage={setCurrentPage}
                            showDatePicker

                        />
                    )}


                    {/* Missed Follow Ups Toggle */}
                    <button
                        className={`btn btn-sm ${missedFUActive ? "btn-primary bg-blue-600" : "btn-outline"}`}
                        onClick={() => {
                            setMissedFUActive(!missedFUActive);
                            setCurrentPage(1);  
                        }}
                    >
                        Missed Follow Ups (12)
                    </button>

                    {/* Filter by Followed Date */}


                </div>


            </div>

            {/* Leads Table */}

            <LeadTable
                leads={leads}
                setSelectedLead={setSelectedLead}
                currentPage={currentPage}
                leadsPerPage={leadsPerPage}
                missedFUActive={missedFUActive}
                followUpActive={followUpActive}
            />

            <div className="flex justify-between mt-6">
                <p className="text-sm">Showing {leadCountStart}–{leadCountEnd} of {leadsCount?.count} results</p>

                {/* Pagination */}
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Items Per Page Selector */}
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-nowrap">Per page:</p>
                        <select
                            className="select select-sm focus:outline-0"
                            value={leadsPerPage}
                            onChange={(e) => {
                                setLeadsPerPage(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[10, 25, 50, 100, 200].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pagination Buttons */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                    />
                </div>


            </div>



            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                searchText={searchText}
                setSearchText={setSearchText}
                onSearch={handleSearch}
                results={leads}
                setCurrentPage={setCurrentPage}
                setSearchQuery={setSearchQuery}
                setIncludeGlobalSearch={setIncludeGlobalSearch}
                includeGlobalSearch={includeGlobalSearch}
            />


            <LeadModals
                selectedLead={selectedLead}
                setSelectedLead={setSelectedLead}
                statusOptions={statusOptions}
                refetch={refetch}
                

            />

        </div>
    );
};

export default AgentAllLeads;



// 582 line