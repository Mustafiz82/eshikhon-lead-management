import { useState, useEffect } from "react";

export default function useLeadSelection(paginatedLeads) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
    const [customSelectCount, setCustomSelectCount] = useState("");

    const handleCheckboxChange = (id, checked) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            checked ? newSet.add(id) : newSet.delete(id);
            return newSet;
        });
    };

    const handleQuickSelect = (count) => {
        const newSet = new Set();
        for (let i = 0; i < Math.min(count, paginatedLeads.length); i++) {
            newSet.add(paginatedLeads[i]._id);
        }
        setSelectedIds(newSet);
        setCustomSelectCount("");
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "a") {
                e.preventDefault();
                const newSet = new Set(selectedIds);
                paginatedLeads.forEach((lead) => newSet.add(lead._id));
                setSelectedIds(newSet);
            } else if ((e.ctrlKey || e.metaKey) && e.key === "d") {
                e.preventDefault();
                const newSet = new Set(selectedIds);
                paginatedLeads.forEach((lead) => newSet.delete(lead._id));
                setSelectedIds(newSet);
            } else if (["ArrowUp", "ArrowDown"].includes(e.key) && document.activeElement.tagName === "BODY") {
                e.preventDefault();
                const direction = e.key === "ArrowDown" ? 1 : -1;
                setActiveRowIndex((prev) => {
                    const max = paginatedLeads.length - 1;
                    const next = prev === null ? (direction > 0 ? 0 : max) : Math.min(max, Math.max(0, prev + direction));
                    if (e.shiftKey && lastSelectedIndex !== null) {
                        const from = Math.min(lastSelectedIndex, next);
                        const to = Math.max(lastSelectedIndex, next);
                        const rangeSet = new Set(selectedIds);
                        for (let i = from; i <= to; i++) rangeSet.add(paginatedLeads[i]._id);
                        setSelectedIds(rangeSet);
                    }
                    return next;
                });
            } else if (["Enter", " "].includes(e.key) && activeRowIndex !== null) {
                e.preventDefault();
                const id = paginatedLeads[activeRowIndex]._id;
                const newSet = new Set(selectedIds);
                if (selectedIds.has(id)) newSet.delete(id);
                else {
                    newSet.add(id);
                    setLastSelectedIndex(activeRowIndex);
                }
                setSelectedIds(newSet);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIds, paginatedLeads, activeRowIndex, lastSelectedIndex]);

    return {
        selectedIds,
        setSelectedIds,
        activeRowIndex,
        setActiveRowIndex,
        lastSelectedIndex,
        setLastSelectedIndex,
        handleCheckboxChange,
        handleQuickSelect,
        customSelectCount,
        setCustomSelectCount,
    };
}
