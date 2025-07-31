"use client";
import { agents } from "@/data/agents";
import AssignModal from "@/components/allLeads/AssignModal";
import LeadFilters from "@/components/allLeads/LeadFilters";
import LeadFooterControls from "@/components/allLeads/LeadFooterControls";
import LeadTable from "@/components/allLeads/LeadTable";
import SearchModal from "@/components/allLeads/SearchModal";
import useLeadFilters from "@/hooks/useLeadFilters";
import useLeadPagination from "@/hooks/useLeadPagination";
import useLeadSelection from "@/hooks/useLeadSelection";
import React, { useEffect, useState } from "react";


const Page = () => {

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);


    const {
        statusFilter, setStatusFilter,
        categoryFilter, setCategoryFilter,
        searchQuery, setSearchQuery,
        searchText, setSearchText,
        filteredLeads,
    } = useLeadFilters();

    const {
        currentPage, setCurrentPage,
        leadsPerPage, setLeadsPerPage,
        paginatedLeads, totalPages, goToPage
    } = useLeadPagination(filteredLeads);

    const {
        selectedIds, setSelectedIds,
        activeRowIndex,
        handleCheckboxChange,
        handleQuickSelect,
        customSelectCount, setCustomSelectCount
    } = useLeadSelection(paginatedLeads);


    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInputFocused = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);

            // Ctrl + K → open Search Modal (unless inside input)
            if (!isInputFocused && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsSearchModalOpen(true);
            }

            // Escape → close Search Modal
            if (e.key === "Escape" && isSearchModalOpen) {
                setIsSearchModalOpen(false);
                setSearchText("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchModalOpen, setSearchText]);





    return (
        <div className="p-6 h-screen overflow-hidden ">
            <LeadFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                setSearchModalOpen={setIsSearchModalOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setCurrentPage={setCurrentPage}
            />

            <LeadTable
                paginatedLeads={paginatedLeads}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                handleCheckboxChange={handleCheckboxChange}
                activeRowIndex={activeRowIndex}
            />

            <LeadFooterControls
                selectedIds={selectedIds}
                handleQuickSelect={handleQuickSelect}
                customSelectCount={customSelectCount}
                setCustomSelectCount={setCustomSelectCount}
                setIsAssignModalOpen={setIsAssignModalOpen}
                leadsPerPage={leadsPerPage}
                setLeadsPerPage={setLeadsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                goToPage={goToPage}
            />


            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                searchText={searchText}
                setSearchText={setSearchText}
                onSearch={setSearchQuery}
                results={filteredLeads}
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
