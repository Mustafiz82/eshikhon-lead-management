


"use client";
import Dropdown from "@/components/agentLeads/Dropdown";
import AssignModal from "@/components/allLeads/AssignModal";
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
    // applied search keyword for filtering

    // 🔹 Selection
    const [selectedIds, setSelectedIds] = useState(new Set());     // selected lead IDs
    const [activeRowIndex, setActiveRowIndex] = useState(null);    // current row index (keyboard nav)
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null); // last row index for shift+select
    const [customSelectCount, setCustomSelectCount] = useState(""); // quick select custom number

    // 🔹 Pagination
    const [currentPage, setCurrentPage] = useState(1);             // current page number
    const [leadsPerPage, setLeadsPerPage] = useState(50);          // leads shown per page

    // 🔹 Modals
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // search modal open/close
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // assign modal open/close


    const { data: leads, loading, error , refetch} = useFetch("/leads")
    const { data: course } = useFetch("/course")

    console.log(leads)






    const handleQuickSelect = (count) => {
        const newSet = new Set();
        for (let i = 0; i < Math.min(count, filteredLeads.length); i++) {
            newSet.add(filteredLeads[i]._id);
        }
        setSelectedIds(newSet);
        setCustomSelectCount("");
    };


    const handleCheckboxChange = (id, checked) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            checked ? newSet.add(id) : newSet.delete(id);
            return newSet;
        });
    };





    const totalPages = 10


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

            // Keyboard row navigation
            if (document.activeElement.tagName === "BODY") {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveRowIndex((prev) => {
                        const next = prev === null || prev >= leads.length - 1 ? 0 : prev + 1;
                        if (e.shiftKey && lastSelectedIndex !== null) {
                            const from = Math.min(lastSelectedIndex, next);
                            const to = Math.max(lastSelectedIndex, next);
                            const rangeSet = new Set(selectedIds);
                            for (let i = from; i <= to; i++) {
                                rangeSet.add(leads[i]._id);
                            }
                            setSelectedIds(rangeSet);
                        }
                        return next;
                    });
                }

                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveRowIndex((prev) => {
                        const next = prev === null || prev <= 0 ? leads.length - 1 : prev - 1;
                        if (e.shiftKey && lastSelectedIndex !== null) {
                            const from = Math.min(lastSelectedIndex, next);
                            const to = Math.max(lastSelectedIndex, next);
                            const rangeSet = new Set(selectedIds);
                            for (let i = from; i <= to; i++) {
                                rangeSet.add(leads[i]._id);
                            }
                            setSelectedIds(rangeSet);
                        }
                        return next;
                    });
                }

                // Toggle checkbox on Enter/Space
                if (e.key === " " || e.key === "Enter") {
                    if (activeRowIndex !== null) {
                        e.preventDefault();
                        const id = leads[activeRowIndex]._id;
                        const newSet = new Set(selectedIds);
                        if (selectedIds.has(id)) {
                            newSet.delete(id);
                        } else {
                            newSet.add(id);
                            setLastSelectedIndex(activeRowIndex); // Set for shift selection
                        }
                        setSelectedIds(newSet);
                    }
                }
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
    }, [isSearchModalOpen, activeRowIndex, selectedIds, lastSelectedIndex]);




    useEffect(() => {
        const obj = {
            statusFilter, searchText, categoryFilter, sortMethod , leadsPerPage , currentPage
        }



        console.log(obj)
        refetch()
    }, [statusFilter, searchText, categoryFilter, sortMethod , currentPage , leadsPerPage ])




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



            {/* Table */}
            <div className="rounded-sm  h-[calc(100vh-160px)] overflow-scroll  border border-base-content/10 bg-base-200/10 shadow overflow-x-auto">
                <table className="table table-pin-rows table-pin-cols table-zebra w-full">
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
                                <tr key={actualIndex} className={`${activeRowIndex === index ? "bg-blue-100 dark:!bg-blue-900/50" : ""}`}>
                                    <td className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm rounded-sm checkbox-primary border-blue-600 checked:bg-blue-600 "
                                            onChange={(e) => handleCheckboxChange(lead._id, e.target.checked)}
                                            checked={selectedIds.has(lead._id)}
                                        />
                                        <span className="text-xs opacity-60">
                                            {actualIndex + 1}
                                        </span>
                                    </td>
                                    <td>{formateDate(lead?.createdAt)}</td>
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td className="max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis" title={lead.address} >{lead.address}</td>
                                    <td>
                                        <span className="badge badge-neutral badge-sm">
                                            {lead.seminarTopic}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge badge-sm ${lead.status
                                                ? "badge-success"
                                                : "badge-warning text-white text-nowrap"
                                                }`}
                                        >
                                            {lead?.assingStatus == true ? "Assigned" : "Not Assigned"}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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





            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                searchText={searchText}
                setSearchText={setSearchText}

                results={leads}
                setCurrentPage={setCurrentPage}
            />

            <AssignModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                agents={agents}
                selectedCount={selectedIds.size}
                onAssign={(agent) => {
                    console.log(`Assigning ${selectedIds.size} leads to ${agent.name}`);
                    setIsAssignModalOpen(false);
                }}
            />




        </div>
    );
};

export default Page;

// 650 line










