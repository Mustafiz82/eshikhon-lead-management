"use client";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { leads } from "@/data/leads";
import Pagination from "@/shared/Pagination";
import SearchModal from "@/components/allLeads/SearchModal";
import SidebarFooter from "@/shared/SidebarFooter";
import Dropdown from "@/components/agentLeads/Dropdown";
import LeadModals from "@/components/agentLeads/LeadModals";
import LeadTable from "@/components/agentLeads/LeadTable";
import { useParams } from "next/navigation";


const Page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const {id} = useParams()

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSeminar, setSelectedSeminar] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedAssingedDate, setSelectedAssignedDate] = useState("All")
    const [followUpActive, setFollowUpActive] = useState(false);
    const [selectedFollowedDate, setSelectedFollowedpDate] = useState("All")
    const [selectedSortMethod, setSelectedSortMethod] = useState("None")
    const [selectedStage, setSelectedStage] = useState("All")

    const [searchText, setSearchText] = useState("");
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);

    const seminarOptions = ["All", "Digital Marketing", "Graphic Design", "Career Guideline", "Ethical Hacking", "Web Development"];
    const statusOptions = ["All", "NOB", "CNR", "NoF", "Join Letter", "Will Join", "Joined", "Admitted"];
    const assignedDateOptions = ["All", "Today", "This Week", "This Month", "This Year"]
    const followedOptions = ["All", "Next 3 Days", "Next 7 Days", "Next 30 Days", "This Year"]
    const sortOptions = ["None", "Name (A–Z)", "Name (Z–A)", "Assigned Date (Newest)", "Assigned Date (Oldest)"]
    const stageOptions = ["All", "Pending", "Contacted"];


    const handleSearch = (term) => {
        setSearchQuery(term);
        setCurrentPage(1);
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
                        dropdownPosition=""
                        selectedState={selectedSortMethod}
                        setSelectedState={setSelectedSortMethod}
                        label="Sort By"
                        options={sortOptions}
                        setCurrentPage
                        defaultOptions="None"

                    />
                </div>


                <h2> Leads Assigned to Agent {id} </h2> 

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




                <div className="flex flex-wrap justify-between items-center gap-4 ">


                    {/* filter by Seminar topic*/}
                    <Dropdown
                        dropdownPosition="dropdown-end"
                        selectedState={selectedSeminar}
                        setSelectedState={setSelectedSeminar}
                        label="Seminar Topic"
                        options={seminarOptions}
                        setCurrentPage

                    />

                    {/* filter by Status */}
                    <Dropdown
                        dropdownPosition=""
                        selectedState={selectedStatus}
                        setSelectedState={setSelectedStatus}
                        label="Status"
                        options={statusOptions}
                        setCurrentPage

                    />

                    {/* Filter by Assigned Date  */}
                    <Dropdown
                        dropdownPosition=""
                        selectedState={selectedAssingedDate}
                        setSelectedState={setSelectedAssignedDate}
                        label="Assigned Date"
                        options={assignedDateOptions}
                        setCurrentPage

                    />

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

                    {/* Filter by Followed Date */}
                    {followUpActive && (

                        <Dropdown
                            dropdownPosition="dropdown-end"
                            selectedState={selectedFollowedDate}
                            setSelectedState={setSelectedFollowedpDate}
                            label="Followed Date"
                            options={followedOptions}
                            setCurrentPage

                        />
                    )}

                </div>


            </div>

            {/* Leads Table */}

            <LeadTable
                leads={leads}
                setSelectedLead={setSelectedLead}
                currentPage={currentPage}
            />

            <div className="flex justify-between mt-6">
                <div className="flex  gap-5 items-center">

                    <p className="text-sm">Showing 1–10 of 45 results</p>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={10}
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


            <LeadModals
                selectedLead={selectedLead}
                setSelectedLead={setSelectedLead}
                statusOptions={statusOptions}

            />

        </div>
    );
};

export default Page;



// 582 line