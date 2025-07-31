import { useState } from "react";
import { leads } from "@/data/leads";

export default function useLeadFilters() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = statusFilter === "All" || lead.status === statusFilter;
    const categoryMatch = categoryFilter === "All" || lead.seminarTopic === categoryFilter;
    const searchMatch =
      searchQuery === "" ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.number.includes(searchQuery);
    return statusMatch && categoryMatch && searchMatch;
  });

  return {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    searchText,
    setSearchText,
    filteredLeads,
  };
}
