


"use client";
import Dropdown from "@/components/agentLeads/Dropdown";
import AssignModal from "@/components/allLeads/AssignModal";
import LeadTable from "@/components/allLeads/LeadTable";
import SearchModal from "@/components/allLeads/SearchModal";
import { agents } from "@/data/agents";
import { leads } from "@/data/leads";
import useFetch from "@/hooks/useFetch";
import Pagination from "@/shared/Pagination";
import { formateDate } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";


const Page = () => {
    // 🔹 Filters
    const [statusFilter, setStatusFilter] = useState("All");       // filter leads by status
    const [categoryFilter, setCategoryFilter] = useState("All");   // filter leads by category
    const [sortMethod, setSortMethod] = useState("Default")

    // 🔹 Search
    const [searchText, setSearchText] = useState("");              // text typed in search modal input
    const [searchQuery, setSearchQuery] = useState("")// applied search keyword for filtering

    // 🔹 Selection
    const [selectedIds, setSelectedIds] = useState(new Set());     // selected lead IDs
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null); // last row index for shift+select
    const [customSelectCount, setCustomSelectCount] = useState(""); // quick select custom number

    // 🔹 Pagination
    const [currentPage, setCurrentPage] = useState(1);             // current page number
    const [leadsPerPage, setLeadsPerPage] = useState(50);          // leads shown per page

    // 🔹 Modals
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // search modal open/close
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // assign modal open/close




    const params = new URLSearchParams({
        status: (statusFilter == "All") ? "All" : (statusFilter == "Assigned") ? true : false,
        course: categoryFilter,
        search: searchQuery.trim(),
        sort: sortMethod,
        limit: leadsPerPage,
        currentPage: currentPage,
        fields : "table"
    }).toString()


    const { data: leads, loading, error, refetch } = useFetch(`/leads?${params}`)
    const { data: course } = useFetch("/course")
    const { data: leadsCount, refetch: paginateRefetch } = useFetch(`/leads/count?${params}`)



    const handleQuickSelect = (count) => {

        const newSet = new Set();
        for (let i = 0; i < Math.min(count, leads.length); i++) {
            newSet.add(leads[i]._id);
        }
        setSelectedIds(newSet);
        setCustomSelectCount("");
    };

    const handleCheckboxChange = (index, id, checked, shiftKey) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);

            if (shiftKey && lastSelectedIndex !== null) {
                // Select range between last clicked and current
                const from = Math.min(lastSelectedIndex, index);
                const to = Math.max(lastSelectedIndex, index);
                for (let i = from; i <= to; i++) {
                    newSet.add(leads[i]._id);
                }
            } else {
                // Normal single toggle
                checked ? newSet.add(id) : newSet.delete(id);
                setLastSelectedIndex(index); // Remember last clicked
            }

            return newSet;
        });
    };


    const totalPages = Math.round((leadsCount?.count / leadsPerPage)) || 1

    console.log(totalPages)


    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };


    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl + K → Search Modal
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault();
                setIsSearchModalOpen(true);
                return;
            }

            // Escape → Clear Search or Close Modal
            if (e.key === "Escape") {
                if (isSearchModalOpen) {
                    setIsSearchModalOpen(false);
                    setSearchText("");
                } if (isAssignModalOpen) {
                    setIsAssignModalOpen(false)
                }
                else {
                    setSearchQuery("");
                }
                return;
            }

            // Ctrl + A → Select all on current page
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
                e.preventDefault();
                const newSet = new Set(selectedIds);
                leads.forEach((lead) => newSet.add(lead._id));
                setSelectedIds(newSet);
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
                e.preventDefault();
                const newSet = new Set(selectedIds);
                leads.forEach((lead) => newSet.delete(lead._id));
                setSelectedIds(newSet);
                return;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchModalOpen, selectedIds, lastSelectedIndex]);


    useEffect(() => {
        const timeOut = setTimeout(() => {
            setSearchQuery(searchText)
        }, 400);

        return () => clearTimeout(timeOut)
    }, [searchText])

    useEffect(() => {

        // refetch()
        // paginateRefetch()

        if (searchQuery) {
            setCurrentPage(1)
        }
    }, [statusFilter, searchQuery, categoryFilter, sortMethod, currentPage, leadsPerPage])


    return (
        <div className="p-6 h-screen overflow-hidden ">


            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                {/* Status Filter */}
                <div className="flex gap-2">
                    {["All", "Assigned", "Not Assigned"].map((status) => (
                        <button
                            key={status}
                            className={`btn btn-sm ${statusFilter === status
                                ? "btn-primary bg-blue-600 text-white"
                                : "btn-outline"
                                }`}
                            onClick={() => {
                                setStatusFilter(status);
                                setCurrentPage(1);
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>


                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <IoSearchOutline className="text-lg" />
                        <span className="hidden text-sm text-white/70 md:inline">Ctrl + K</span>
                    </button>

                    {searchText && (
                        <button
                            className="btn btn-xs btn-outline"
                            onClick={() => setSearchText("")}
                        >
                            Clear
                        </button>
                    )}
                </div>



                <div className="flex gap-2">
                    <Dropdown
                        dropdownPosition="dropdown-end"
                        selectedState={categoryFilter}
                        setSelectedState={setCategoryFilter}
                        label="Select Course"
                        options={["All", ...course.map(item => item.name)]}
                        setCurrentPage={setCurrentPage}
                    />
                    <Dropdown
                        dropdownPosition="dropdown-end"
                        selectedState={sortMethod}
                        setSelectedState={setSortMethod}
                        label="Sort By"
                        options={["Default", "Ascending", "Descending"]}
                        setCurrentPage={setCurrentPage}
                        defaultOptions={"Default"}
                    />
                </div>
            </div>


            {
                loading ? <div className="w-full flex gap-3 justify-center items-center h-96"><span className="loading loading-spinner text-blue-600"></span> Loading...  </div> : ""

            }

            {/* Table */}
            {!loading && <>

                <LeadTable
                    currentPage={currentPage}
                    leads={leads}
                    handleCheckboxChange={handleCheckboxChange}
                    leadsPerPage={leadsPerPage}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}

                />

                {/* Footer Controls */}
                <div className="mt-4 flex flex-wrap justify-between items-center gap-4 border-t border-base-content/10 pt-4">
                    {/* Assignment Tools */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm">
                            Selected: <b>{selectedIds.size}</b>
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm">Quick Select:</span>
                            {[10, 50, 100].map((count) => (
                                <button
                                    key={count}
                                    className={`btn btn-xs ${selectedIds.size === count ? "btn-primary bg-blue-600" : "btn-outline"
                                        }`}
                                    onClick={() => handleQuickSelect(count)}
                                >
                                    {count}
                                </button>
                            ))}

                            {/* Custom Input */}
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
                                    className="input input-xs focus:outline-none border-white pl-2 !rounded-none input-bordered w-16"
                                    value={customSelectCount}
                                    onChange={(e) => setCustomSelectCount(e.target.value)}
                                    placeholder="Custom"
                                />

                            </form>
                        </div>


                        <button
                            className="btn bg-blue-600 btn-sm btn-primary"
                            onClick={() => setIsAssignModalOpen(true)}
                        >
                            Assign to
                        </button>

                    </div>

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
            </>}





            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                searchText={searchText}
                setSearchText={setSearchText}
                setSearchQuery={setSearchQuery}
                results={leads}
                setCurrentPage={setCurrentPage}
                
            />

            <AssignModal
                isOpen={isAssignModalOpen}
                refetch={refetch}
                onClose={() => setIsAssignModalOpen(false)}
                agents={agents}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                setIsAssignModalOpen={setIsAssignModalOpen}
            />

        </div>
    );
};

export default Page;

// 650 line


