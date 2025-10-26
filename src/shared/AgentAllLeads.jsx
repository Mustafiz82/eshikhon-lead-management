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
import { IoIosArrowDown } from "react-icons/io";


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
    const [selectedMissedFollowedDate, setSelectedMissedFolllowUpDate] = useState("All")

    const [includeGlobalSearch, setIncludeGlobalSearch] = useState(false)
    const [dropdownOpen, setDropDownOpen] = useState(false)

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
        missedFollwUpDate: selectedMissedFollowedDate

    })


    const { data: leadsCount, refetch: paginateRefetch } = useFetch(`/leads/count?${params}`)
    const { data: leads, loading, refetch } = useFetch(`/leads?${params}`)
    const { data: course } = useFetch("/course")



    const statusOptions = [
        "All",
        "Pending",
        "Enrolled",
        "Joined on seminar",
        "Will Join on Seminar",
        "Not Interested",
        "Enrolled in Other Institute",
        "Call declined",
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





    return (
        <div className="p-6 overflow-hidden mx-auto min-h-[calc(100vh-100px)]  xl:min-h-screen">
            {/* Filters */}
            <div className={`flex ${dropdownOpen ? "h-64 md:h-42" : "h-10"} bg-gray-900 -mt-2  fixed xl:static z-[9999] w-full left-0 px-5 xl:px-0 duration-300 flex-wrap justify-between  gap-4 mb-4`}>

                <div onClick={() => setDropDownOpen(!dropdownOpen)} className="flex xl:hidden justify-between items-center w-full  px-0">
                    <h2 className="text-lg ">Open filter </h2>
                    <IoIosArrowDown />
                </div>
                {/*filter by stage */}
                <div className=" grid  grid-cols-2 md:flex w-full xl:w-auto  flex-wrap gap-2">

                    {/* Sort By Dropdown */}
                    <Dropdown
                        dropdownPosition="dropdown-start"
                        selectedState={selectedStage}
                        setSelectedState={setSelectedStage}
                        label="Contact Status"
                        options={stageOptions}
                        setCurrentPage={setCurrentPage}
                        defaultOptions={"All"}
                    />


                    {/* Sort By Dropdown */}
                    <Dropdown
                        dropdownPosition="dropdown-start"
                        selectedState={selectedSortMethod}
                        setSelectedState={setSelectedSortMethod}
                        label="Sort By"
                        options={["Default", "Ascending", "Descending"]}
                        setCurrentPage={setCurrentPage}
                        defaultOptions={"Default"}
                    />

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

                </div>

                {/* Search */}
                <div className="flex fixed xl:static top-7 z-[999] right-[25%] md:right-24 items-center gap-2">
                    <button
                        onClick={() => setSearchModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <IoSearchOutline className="text-lg" />
                        <span className="hidden text-sm text-white/70 xl:inline">Ctrl + K</span>
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


                <div className="grid grid-cols-2 md:flex w-full xl:w-auto  flex-wrap justify-between items-center gap-2 ">


                    {/* filter by Seminar topic*/}



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
                            setSelectedMissedFolllowUpDate("All")
                            setCurrentPage(1);
                        }}
                    >
                        Missed Follow Ups (12)
                    </button>

                    {/* Filter by Followed Date */}

                    {missedFUActive && (

                        <Dropdown
                            dropdownPosition="dropdown-end"
                            selectedState={selectedMissedFollowedDate}
                            setSelectedState={setSelectedMissedFolllowUpDate}
                            label="Missed Folloup Date"
                            options={assignedDateOptions}
                            setCurrentPage={setCurrentPage}
                            showDatePicker

                        />
                    )}



                </div>


            </div>
            {
                loading ? <div className="w-full flex gap-3 justify-center items-center h-96"><span className="loading loading-spinner text-blue-600"></span> Loading...  </div> : ""

            }

            {/* Table */}
            {!loading && <>

                {/* Leads Table */}

                <div className="mt-10 xl:mt-0">
                    <LeadTable
                        leads={leads}
                        setSelectedLead={setSelectedLead}
                        currentPage={currentPage}
                        leadsPerPage={leadsPerPage}
                        missedFUActive={missedFUActive}
                        followUpActive={followUpActive}
                    />
                </div>

                <div className="flex flex-col justify-between mt-6">


                    {/* Pagination */}
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Items Per Page Selector */}
                        <div className="flex justify-between w-full items-center gap-5">
                            <p className="text-sm flex-1 text-nowrap">Showing {leadCountStart}–{leadCountEnd} of {leadsCount?.count} results</p>
                            <div className="flex justify-between w-full md:w-auto items-center gap-2">
                                <p className="text-sm flex-1 text-nowrap">per page :</p>
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
                            <div className="hidden md:block">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={goToPage}
                                />
                            </div>
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex md:hidden justify-center w-full xl:w-auto">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                            />
                        </div>
                    </div>
                    {/* Pagination */}
                    {/* <div className="flex items-center gap-4 flex-wrap">
                       
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

                       
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                        />
                    </div> */}


                </div>

            </>}

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
                course={course}


            />

        </div>
    );
};

export default AgentAllLeads;



// 582 line