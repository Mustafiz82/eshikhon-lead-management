


"use client";
import axiosPublic from "@/api/axios";
import Dropdown from "@/components/agentLeads/Dropdown";
import AssignModal from "@/components/allLeads/AssignModal";
import LeadTable from "@/components/allLeads/LeadTable";
import SearchModal from "@/components/allLeads/SearchModal";
import { agents } from "@/data/agents";
import { leads } from "@/data/leads";
import useFetch from "@/hooks/useFetch";
import Pagination from "@/shared/Pagination";
import { formateDate } from "@/utils/date";
import { showAlert, showConfirm } from "@/utils/swal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { BiSolidLockAlt } from "react-icons/bi";
import { BiSolidLockOpen } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import EditDrawer from "@/components/allLeads/EditDrawer";


const Page = () => {
    // 🔹 Filters
    const [statusFilter, setStatusFilter] = useState("All");       // filter leads by status
    const [categoryFilter, setCategoryFilter] = useState("All");   // filter leads by category
    const [sortMethod, setSortMethod] = useState("Default");
    const [lockSTatus, setLockStatus] = useState("All");

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


    //editLeadsDrawer
    const [showDrawer, setShowDrawer] = useState(false);
    const [editLead, setEditLead] = useState(null);





    const params = new URLSearchParams({
        status: (statusFilter == "All") ? "All" : (statusFilter == "Assigned") ? true : false,
        course: categoryFilter,
        search: searchQuery.trim(),
        sort: sortMethod,
        limit: leadsPerPage,
        currentPage: currentPage,
        fields: "table",
        lock: lockSTatus
    }).toString()


    const { data: leads, loading, error, refetch } = useFetch(`/leads?${params}`)
    const { data: rawCourses } = useFetch("/course");

    console.log(rawCourses)

    // Remove duplicates
    

    const course = Array.from(
        new Map(rawCourses?.map((item) => [item.name, item])).values()
    );


    console.log(course)

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
    }, [statusFilter, searchQuery, categoryFilter, sortMethod, currentPage, leadsPerPage, lockSTatus])


    const handleDeleteLeads = async () => {

        const ids = [...selectedIds];

        if (!(ids?.length > 0)) {
            return showAlert(
                "No leads selected",
                "Please select at least one lead To Delete",
                "warning"
            );
        }
        const result = await showConfirm(
            "Are you sure?",
            "This action will permanently delete selected leads.",
            "Yes, delete it!"
        );

        if (result.isConfirmed) {

            try {
                const res = await axiosPublic.delete("/leads", { data: { ids } })
                console.log(res.data)
                refetch()
                paginateRefetch()
            } catch (error) {
                console.log(error)

            }

            console.log(ids);
        }

    }




    const findLockStatus = () => {
        const ids = [...selectedIds];

        const filteredLeads = leads.filter(lead =>
            ids.includes(lead._id.toString())
        );

        if (filteredLeads.length === 0) return false;
        // Check if ALL filtered leads have isLocked = true
        const allLocked = filteredLeads.every(lead => lead.isLocked === true);

        console.log("All Locked:", allLocked);
        return allLocked;
    };

    const showLockStatus = findLockStatus();




    const findAssignStatus = () => {
        const ids = [...selectedIds];
        const filteredLeads = leads.filter(lead => ids.includes(lead._id.toString()));

        if (filteredLeads.length === 0) return false;

        // check if ALL are assigned
        const allAssigned = filteredLeads.every(lead => lead.assignStatus === true);
        return allAssigned;
    };

    const showAssignStatus = findAssignStatus(); // true = all assigned




    const handleLockLeads = async () => {

        const ids = [...selectedIds];

        if (!(ids?.length > 0)) {
            return showAlert(
                "No leads selected",
                `Please select at least one lead To ${showLockStatus ? "Unlock" : "lock"}`,
                "warning"
            );
        }
        const result = await showConfirm(
            "Are you sure?",
            `This action will ${showLockStatus ? "unlock" : "lock"} the selected leads, ${showLockStatus ? "allowing" : "preventing"} agents from making changes.`,
            `Yes,  ${showLockStatus ? "Unlock" : "lock"} it!`
        );

        if (result.isConfirmed) {


            console.log(ids)

            const payload = {
                ids: ids,
                update: { isLocked: !showLockStatus }
            }

            try {
                const res = await axiosPublic.patch("/leads", payload)
                console.log(res.data)
                refetch()
                paginateRefetch()
                setSelectedIds(new Set())
            } catch (error) {
                console.log(error)

            }

            console.log(ids);
        }
    }


    const handleAssignToggle = async () => {
        const ids = [...selectedIds];

        if (!(ids?.length > 0)) {
            return showAlert(
                "No leads selected",
                `Please select at least one lead to ${showAssignStatus ? "unassign" : "assign"}.`,
                "warning"
            );
        }

        // If not assigned, open modal instead of assigning directly
        if (!showAssignStatus) {
            setIsAssignModalOpen(true);
            return;
        }

        // If already assigned → Unassign directly
        const result = await showConfirm(
            "Are you sure?",
            "This action will unassign the selected leads.",
            "Yes, unassign them!"
        );

        if (result.isConfirmed) {
            try {
                const payload = { ids, update: { assignTo: "", assignStatus: false } };
                const res = await axiosPublic.patch("/leads", payload);

                showAlert("Unassigned", `${res.data.modified || ids.length} lead(s) unassigned successfully.`, "success");

                refetch();
                paginateRefetch();
                setSelectedIds(new Set());
            } catch (error) {
                console.log(error);
                showAlert("Error", error.message, "error");
            }
        }
    };



    useEffect(() => {
        findLockStatus()
    }, [selectedIds])

    useEffect(() => {
        findAssignStatus();
    }, [selectedIds]);








    console.log(showLockStatus)

    return (
        <div className="p-6 min-h-[calc(100vh-100px)] lg:h-screen overflow-hidden ">


            {/* Filters */}
            <div className="flex  flex-wrap justify-between items-center gap-4 mb-4">
                {/* Status Filter */}
                <div className="flex w-full lg:w-auto  gap-2">
                    {["All", "Assigned", "Not Assigned"].map((status) => (
                        <button
                            key={status}
                            className={`btn flex-1 lg:flex-auto  btn-sm ${statusFilter === status
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


                <div className="flex fixed lg:static top-7 right-[25%] items-center gap-2">
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



                <div className="flex w-full lg:w-auto gap-2">
                    <Dropdown
                        dropdownPosition="dropdown-start"
                        selectedState={lockSTatus}
                        setSelectedState={setLockStatus}
                        label="Lock Status"
                        options={["All", "Locked", "Unlocked"]}
                        setCurrentPage={setCurrentPage}
                        defaultOptions={"All"}
                    />
                    <Dropdown
                        dropdownPosition="lg:dropdown-end"
                        selectedState={categoryFilter}
                        setSelectedState={setCategoryFilter}
                        label="Select Course"
                        options={["All", ...course
                            .slice() // clone to avoid mutating original
                            .sort((a, b) => a?.name?.localeCompare(b.name)) // ✅ sort alphabetically
                            .map(item => item.name)
                        ]}
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
                    onEdit={(lead) => {
                        setEditLead(lead);
                        setShowDrawer(true);
                    }}

                />

                {/* Footer Controls */}
                <div className="mt-4 flex flex-col lg:flex-row   justify-between items-center gap-4 border-t border-base-content/10 pt-4">
                    {/* Assignment Tools */}
                    <div className="flex  w-full  justify-between  items-center gap-2">
                        <span className="text-sm hidden md:block text-nowrap">
                            Selected: <b>{selectedIds.size}</b>
                        </span>
                        <div className="flex w-full md:w-auto lg:w-full items-center gap-2 ">
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
                            {/* <button
                                className="btn bg-blue-600 btn-sm btn-primary"
                                onClick={() => setIsAssignModalOpen(true)}
                            >
                                Assign to
                            </button> */}
                            <button
                                className="btn flex bg-blue-600 btn-sm btn-success border-blue-600 text-white"
                                onClick={handleAssignToggle}
                            >
                                {showAssignStatus ? "Unassign" : "Assign"}
                            </button>

                            <button
                                className="btn flex gap-1 bg-red-500 btn-sm btn-error text-white"
                                onClick={handleDeleteLeads}
                            >
                                <MdDelete />
                                Delete
                            </button>
                            <button
                                className="btn flex bg-[#a855f7]  btn-sm btn-primary border-[#a855f7] text-white"
                                onClick={handleLockLeads}
                            >
                                {showLockStatus ? <BiSolidLockOpen /> : <BiSolidLockAlt />}  {showLockStatus ? "Unlock" : "lock"}

                            </button>
                        </div>



                    </div>

                    {/* Pagination */}
                    <div className="flex md:justify-between md:w-full items-center gap-4 flex-wrap">
                        {/* Items Per Page Selector */}
                        <div className="flex justify-between lg:ml-auto lg:justify-start w-full md:w-auto items-center gap-2">
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
                            <span className="text-sm lg:hidden text-nowrap">
                                Selected: <b>{selectedIds.size}</b>
                            </span>
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


            {/* 🟦 Lead Edit Drawer */}
            <EditDrawer
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                editLead={editLead}
                course={course}
                setEditLead={setEditLead}
                refetch={refetch}

            />

        </div>
    );
};

export default Page;

// 650 line


