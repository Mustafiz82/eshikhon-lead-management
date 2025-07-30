import { useState, useMemo } from "react";

export default function useLeadPagination(filteredLeads, defaultPerPage = 50) {
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage, setLeadsPerPage] = useState(defaultPerPage);

    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const paginatedLeads = useMemo(() => {
        return filteredLeads.slice(
            (currentPage - 1) * leadsPerPage,
            currentPage * leadsPerPage
        );
    }, [filteredLeads, currentPage, leadsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return {
        currentPage,
        setCurrentPage,
        leadsPerPage,
        setLeadsPerPage,
        paginatedLeads,
        totalPages,
        goToPage,
    };
}
