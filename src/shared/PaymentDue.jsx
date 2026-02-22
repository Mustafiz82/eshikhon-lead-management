import { AuthContext } from '@/context/AuthContext';
import React, { useContext } from 'react';
import { TbCurrencyTaka } from 'react-icons/tb';

const PaymentDue = ({ PENDING_PAYMENTS_DATA, handleOpenPayModal, loading }) => {

    const { user } = useContext(AuthContext)
    
    return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-900 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                            <th className="p-4 font-semibold">Month</th>
                            <th className="p-4 font-semibold">Agent Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold text-center">Sales</th>
                            <th className="p-4 font-semibold text-center">Target %</th>
                            <th className="p-4 font-semibold text-right">Commission Due</th>
                            <th className="p-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm divide-y divide-slate-700">
                        {(PENDING_PAYMENTS_DATA || []).map((item) => (
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
                                        className={`px-2 py-1 rounded text-xs font-bold ${(item.targetCompletionRate ?? 0) >= 100
                                            ? "bg-green-500/10 text-green-500"
                                            : "bg-yellow-500/10 text-yellow-500"
                                            }`}
                                    >
                                        {item.targetCompletionRate ?? 0}%
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center justify-end text-right font-bold text-white">
                                        {Number(item.commissionDue ?? 0).toFixed(2)} <TbCurrencyTaka />
                                    </div>

                                    {/* Extra info (not deleting UI; only adding clarity) */}
                                    <div className="text-right text-xs text-slate-400">
                                        Paid: {Number(item.totalPaid ?? 0).toFixed(2)} | Due:{" "}
                                        {Number(item.balance ?? 0).toFixed(2)}
                                    </div>
                                </td>

                                <td className="p-4 text-center">

                                    {
                                        user.role == "admin" ? <button
                                            disabled={item.status === "paid"}
                                            onClick={() => handleOpenPayModal(item)}
                                            className={`px-4 cursor-pointer py-1.5 rounded text-xs font-medium transition-colors shadow-lg ${item.status === "paid"
                                                ? "bg-slate-600 cursor-not-allowed opacity-60"
                                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                                                }`}
                                        >
                                            {item.status === "paid" ? "Paid" : "Pay Now"}
                                        </button> : <button className="bg-slate-600 cursor-not-allowed opacity-60  px-4 py-1.5 rounded text-xs font-medium transition-colors shadow-lg ">{item.status === "paid" ? "paid" : "Pending Payment"}</button>
                                    }



                                </td>
                            </tr>
                        ))}

                        {!loading && (!PENDING_PAYMENTS_DATA || PENDING_PAYMENTS_DATA.length === 0) && (
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