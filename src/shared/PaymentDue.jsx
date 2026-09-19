"use client";

import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useMemo, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const PaymentDue = ({ PENDING_PAYMENTS_DATA = [], handleOpenPayModal, loading }) => {
    const { user } = useContext(AuthContext);

    // Sorting state: { key: string, direction: 'asc' | 'desc' | null }
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // Handle Header Click to cycle: asc -> desc -> null
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") {
                direction = "desc";
            } else if (sortConfig.direction === "desc") {
                direction = null; // reset to original order
            }
        }
        setSortConfig({ key: direction ? key : null, direction });
    };

    // Sort icon renderer
    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey || !sortConfig.direction) {
            return <FaSort className="text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity text-xs" />;
        }
        if (sortConfig.direction === "asc") {
            return <FaSortUp className="text-blue-400 text-xs translate-y-0.5" />;
        }
        return <FaSortDown className="text-blue-400 text-xs -translate-y-0.5" />;
    };

    // Sorted list calculation
 // Sorted list calculation
const sortedData = useMemo(() => {
    if (!PENDING_PAYMENTS_DATA) return [];
    if (!sortConfig.key || !sortConfig.direction) return PENDING_PAYMENTS_DATA;

    return [...PENDING_PAYMENTS_DATA].sort((a, b) => {
        // 1. Special Handling for Month: sort chronologically using monthKey (or date)
        if (sortConfig.key === "month") {
            const dateA = a.monthKey ? new Date(a.monthKey).getTime() : new Date(a.month).getTime();
            const dateB = b.monthKey ? new Date(b.monthKey).getTime() : new Date(b.month).getTime();
            return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Normalize null or undefined
        if (aVal === undefined || aVal === null) aVal = "";
        if (bVal === undefined || bVal === null) bVal = "";

        // 2. Numeric comparison
        if (typeof aVal === "number" || typeof bVal === "number") {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
            return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        // 3. String comparison
        const comparison = String(aVal).localeCompare(String(bVal), undefined, {
            numeric: true,
            sensitivity: "base",
        });
        return sortConfig.direction === "asc" ? comparison : -comparison;
    });
}, [PENDING_PAYMENTS_DATA, sortConfig]);

    return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse select-none">
                    <thead>
                        <tr className="bg-gray-900 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                            {/* Month */}
                            <th
                                onClick={() => handleSort("month")}
                                className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span>Month</span>
                                    {renderSortIcon("month")}
                                </div>
                            </th>

                            {/* Agent Name */}
                            <th
                                onClick={() => handleSort("agentName")}
                                className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span>Agent Name</span>
                                    {renderSortIcon("agentName")}
                                </div>
                            </th>

                            {/* Email */}
                            <th
                                onClick={() => handleSort("agentEmail")}
                                className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span>Email</span>
                                    {renderSortIcon("agentEmail")}
                                </div>
                            </th>

                            {/* Sales */}
                            <th
                                onClick={() => handleSort("totalSales")}
                                className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group text-center"
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <span>Sales</span>
                                    {renderSortIcon("totalSales")}
                                </div>
                            </th>

                            {/* Target % */}
                            <th
                                onClick={() => handleSort("targetCompletionRate")}
                                className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group text-center"
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <span>Target %</span>
                                    {renderSortIcon("targetCompletionRate")}
                                </div>
                            </th>

                            {/* Commission Due */}
                            <th
                                onClick={() => handleSort("commissionDue")}
                                className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group text-right"
                            >
                                <div className="flex items-center justify-end gap-1.5">
                                    <span>Commission Due</span>
                                    {renderSortIcon("commissionDue")}
                                </div>
                            </th>

                            {/* Action (non-sortable) */}
                            <th className="p-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm divide-y divide-slate-700">
                        {sortedData.map((item) => (
                            <tr
                                key={`${item.agentEmail || "na"}__${item.monthKey || item.month || "na"}`}
                                className="hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="p-4 font-medium text-white">{item.month}</td>
                                <td className="p-4 text-blue-400 font-medium">{item.agentName}</td>
                                <td className="p-4 text-slate-400">{item.agentEmail}</td>
                                <td className="p-4 text-center">{item.totalSales}</td>

                                <td className="p-4 text-center">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${
                                            (item.targetCompletionRate ?? 0) >= 100
                                                ? "bg-green-500/10 text-green-500"
                                                : "bg-yellow-500/10 text-yellow-500"
                                        }`}
                                    >
                                        {item.targetCompletionRate ?? 0}%
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center justify-end text-right font-bold text-white">
                                        {Number(item.commissionDue ?? 0)} <TbCurrencyTaka />
                                    </div>
                                    <div className="text-right text-xs text-slate-400">
                                        Paid: {Number(item.totalPaid ?? 0)} | Due: {Number(item.balance ?? 0)}
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    {user?.role === "admin" ? (
                                        <button
                                            // disabled={item.status === "paid"}
                                            onClick={() => handleOpenPayModal(item)}
                                            className={`px-4 cursor-pointer py-1.5 rounded text-xs font-medium transition-colors shadow-lg ${
                                                item.status === "paid"
                                                    ? "bg-slate-600 cursor-not-allowed opacity-60"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                                            }`}
                                        >
                                            {item.status === "paid" ? "Paid" : "Pay Now"}
                                        </button>
                                    ) : (
                                        <button className="bg-slate-600 cursor-not-allowed opacity-60 px-4 py-1.5 rounded text-xs font-medium transition-colors shadow-lg">
                                            {item.status === "paid" ? "paid" : "Pending Payment"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {!loading && sortedData.length === 0 && (
                            <tr>
                                <td className="p-6 text-center text-slate-400" colSpan={7}>
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {loading && <div className="p-6 text-center text-slate-400">Loading...</div>}
            </div>
        </div>
    );
};

export default PaymentDue;