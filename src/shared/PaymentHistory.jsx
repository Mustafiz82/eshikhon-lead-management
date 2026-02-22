import React from 'react';
import { formatDate } from './Payments';
import { FaHistory } from 'react-icons/fa';

const PaymentHistory = ({ historyData, historyLoading }) => {

    // monthKey: "2025-11" => "Nov 2025"
    const monthKeyToLabel = (monthKey) => {
        try {
            if (!monthKey || typeof monthKey !== "string") return "";
            const [y, m] = monthKey.split("-");
            const year = Number(y);
            const month = Number(m);
            if (!Number.isFinite(year) || !Number.isFinite(month)) return monthKey;

            const dt = new Date(year, month - 1, 1);
            return dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } catch {
            return monthKey || "";
        }
    };
    return (

        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg text-purple-500">
                    <FaHistory />
                </div>
                <h2 className="text-xl font-semibold text-white">Payment History</h2>
            </div>

            <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                                <th className="p-4 font-semibold">Date Paid</th>
                                <th className="p-4 font-semibold">Month Paid For</th>
                                <th className="p-4 font-semibold">Agent Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold text-right">Amount Paid</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm divide-y divide-slate-700">
                            {historyLoading ? (
                                <tr>
                                    <td className="p-6 text-center text-slate-400" colSpan={6}>
                                        Loading history...
                                    </td>
                                </tr>
                            ) : (historyData || []).length === 0 ? (
                                <tr>
                                    <td className="p-6 text-center text-slate-400" colSpan={6}>
                                        No payment history found
                                    </td>
                                </tr>
                            ) : (
                                (historyData || []).map((p, idx) => (
                                    <tr key={p._id || idx} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-slate-300">{formatDate(p.paidAt)}</td>
                                        <td className="p-4 font-medium text-white">{monthKeyToLabel(p.monthKey)}</td>
                                        <td className="p-4 text-blue-400">{p.agentName || "-"}</td>
                                        <td className="p-4 text-slate-400">{p.agentEmail}</td>
                                        <td className="p-4 text-right font-bold text-green-400">
                                            {Number(p.amount ?? 0).toFixed(2)} ৳
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/30">
                                                {p.status === "completed" ? "Completed" : p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default PaymentHistory;