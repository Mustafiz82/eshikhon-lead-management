// "use client";

// import axiosPublic from "@/api/axios";
// import useFetch from "@/hooks/useFetch";
// import { showAlert } from "@/utils/swal";
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { FaTimes, FaHistory, FaStickyNote } from "react-icons/fa";
// import { AuthContext } from "@/context/AuthContext";

// const PaymentModal = ({
//     selectedPayment,
//     handleCloseModal,
//     refetchHistory,
//     refetchPending,
//     historyData = [], // <--- RECEIVED HERE
// }) => {
//     const { user } = useContext(AuthContext);

//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     // -------------------------------------------------------------
//     // FILTER PAST PAYMENTS & NOTES FOR THIS SPECIFIC AGENT & MONTH
//     // -------------------------------------------------------------
//     const currentMonthPayments = useMemo(() => {
//         if (!Array.isArray(historyData)) return [];
//         return historyData.filter(
//             (p) =>
//                 p.agentEmail?.toLowerCase() === selectedPayment.agentEmail?.toLowerCase() &&
//                 p.monthKey === selectedPayment.monthKey
//         );
//     }, [historyData, selectedPayment]);

//     // -------------------------------
//     // PAYEE (Agent Profile)
//     // -------------------------------
//     const [payeeState, setPayeeState] = useState({
//         name: "",
//         accountNumber: "",
//         accountDetails: "",
//     });

//     // -------------------------------
//     // PAYER (Admin)
//     // -------------------------------
//     const [payerState, setPayerState] = useState({
//         name: "",
//         number: "",
//         accountType: "",
//     });

//     // Fetch canonical payment profile
//     const { data: paymentInfo } = useFetch(`/user/${selectedPayment.agentEmail}/payment-info`);

//     // Fetch last payment snapshot for diff
//     const { data: lastPayment } = useFetch(`/payments/last/${selectedPayment.agentEmail}`);

//     useEffect(() => {
//         if (paymentInfo) {
//             setPayeeState({
//                 name: paymentInfo.name || "",
//                 accountNumber: paymentInfo.accountNumber || "",
//                 accountDetails: paymentInfo.accountDetails || "",
//             });
//         }
//     }, [paymentInfo]);

//     useEffect(() => {
//         if (lastPayment?.payer) {
//             setPayerState({
//                 name: lastPayment.payer.name || "",
//                 number: lastPayment.payer.number || "",
//                 accountType: lastPayment.payer.accountType || "",
//             });
//         }
//     }, [lastPayment]);

//     // Detect changed fields compared to last snapshot
//     const changedFields = useMemo(() => {
//         if (!lastPayment?.payee) return [];
//         const changed = [];
//         if (payeeState.name !== lastPayment.payee.name) changed.push("name");
//         if (payeeState.accountNumber !== lastPayment.payee.number) changed.push("accountNumber");
//         if (payeeState.accountDetails !== lastPayment.payee.accountDetails) changed.push("accountDetails");
//         return changed;
//     }, [payeeState, lastPayment]);

//     const inputClass = (field) =>
//         `w-full p-3 bg-gray-900 border text-white rounded-lg ${
//             changedFields.includes(field) ? "border-yellow-500 bg-yellow-500/10" : "border-slate-600"
//         }`;

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData(e.target);
//         const amount = Number(formData.get("paymentAmount"));
//         const due = Number(selectedPayment?.balance ?? 0);
//         const note = e.target.note.value;

//         const newErrors = {};

//         if (!amount) newErrors.paymentAmount = "Amount required";
//         else if (amount <= 0) newErrors.paymentAmount = "Amount must be greater than 0";
//         else if (amount > due) newErrors.paymentAmount = "Amount cannot exceed remaining balance";

//         if (!payerState.name) newErrors.payerName = "Payer name required";
//         if (!payerState.number) newErrors.payerNumber = "Payer number required";
//         if (!payerState.accountType) newErrors.accountType = "Select account type";

//         if (!payeeState.name) newErrors.payeeName = "Payee name required";
//         if (!payeeState.accountNumber) newErrors.payeeNumber = "Account number required";
//         if (!payeeState.accountDetails) newErrors.payeeAccountDetails = "Account details required";

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             return;
//         }

//         setErrors({});
//         setLoading(true);

//         try {
//             await axiosPublic.put(`/user/${selectedPayment.agentEmail}/payment-info`, {
//                 name: payeeState.name,
//                 accountNumber: payeeState.accountNumber,
//                 accountDetails: payeeState.accountDetails,
//                 changedBy: user.email,
//             });

//             await axiosPublic.post("/payments/commissions/pay", {
//                 agentEmail: selectedPayment.agentEmail,
//                 monthKey: selectedPayment.monthKey,
//                 amount,
//                 method: "manual",
//                 note: note,
//                 payer: payerState,
//                 payee: {
//                     name: payeeState.name,
//                     number: payeeState.accountNumber,
//                     accountDetails: payeeState.accountDetails,
//                 },
//             });

//             refetchPending();
//             refetchHistory();
//             handleCloseModal();
//             showAlert("Success", "Payment recorded", "success");
//         } catch (err) {
//             showAlert("Error", err?.response?.data?.error || "Payment failed", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const errorText = (name) => errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;

//     const formatDate = (dateStr) => {
//         try {
//             return new Date(dateStr).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//             });
//         } catch {
//             return dateStr;
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
//             <div className="bg-[#1e293b] rounded-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-700">
//                 <div className="bg-gray-900 px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-800">
//                     <h3 className="text-white font-bold">
//                         Process Payment — {selectedPayment.month || selectedPayment.monthKey}
//                     </h3>
//                     <button onClick={handleCloseModal}>
//                         <FaTimes className="text-white hover:text-red-400 transition-colors" />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="p-6 space-y-5">
//                     {/* Summary Header */}
//                     <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-lg border border-slate-700">
//                         <div>
//                             <p className="text-white font-semibold text-lg">{selectedPayment.agentName}</p>
//                             <p className="text-sm text-slate-400">{selectedPayment.agentEmail}</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-xs uppercase text-slate-400 font-semibold mb-1">Remaining Balance</p>
//                             <p className="text-blue-400 font-bold text-lg">
//                                 {Number(selectedPayment.balance ?? 0).toFixed(2)} ৳
//                             </p>
//                         </div>
//                     </div>

//                     {/* 🔥 SECTION: PREVIOUS PAYMENTS, DATES, & NOTES 🔥 */}
//                     <div className="bg-gray-900 rounded-lg p-4 border border-slate-700 space-y-3">
//                         <div className="flex items-center justify-between">
//                             <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-2">
//                                 <FaHistory className="text-purple-400" />
//                                 Payment History ({selectedPayment.month || selectedPayment.monthKey})
//                             </h4>
//                             <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
//                                 {currentMonthPayments.length}{" "}
//                                 {currentMonthPayments.length === 1 ? "Payment Completed" : "Payments Completed"}
//                             </span>
//                         </div>

//                         {currentMonthPayments.length === 0 ? (
//                             <p className="text-xs text-slate-500 italic py-1">
//                                 No previous payments made for this month yet.
//                             </p>
//                         ) : (
//                             <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
//                                 {currentMonthPayments.map((payment, idx) => (
//                                     <div
//                                         key={payment._id || idx}
//                                         className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs space-y-1.5"
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-green-400 font-bold text-sm">
//                                                 +{Number(payment.amount).toFixed(2)} ৳
//                                             </span>
//                                             <span className="text-slate-400 text-[11px]">
//                                                 {formatDate(payment.paidAt)}
//                                             </span>
//                                         </div>

//                                         {payment.note && payment.note.trim() !== "" ? (
//                                             <div className="flex items-start gap-1.5 bg-slate-900/70 p-2 rounded border border-slate-800 text-slate-300">
//                                                 <FaStickyNote className="text-yellow-400 shrink-0 mt-0.5" />
//                                                 <span className="italic">"{payment.note}"</span>
//                                             </div>
//                                         ) : (
//                                             <span className="text-slate-500 italic text-[11px]">No note recorded</span>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Payment Amount */}
//                     <div>
//                         <label className="text-xs font-semibold text-slate-400 mb-1 block">Payment Amount</label>
//                         <input
//                             name="paymentAmount"
//                             type="number"
//                             placeholder="Payment Amount"
//                             className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
//                         />
//                         {errorText("paymentAmount")}
//                     </div>

//                     <div className="flex gap-4">
//                         {/* Payer (Admin) */}
//                         <div className="w-full space-y-3">
//                             <h2 className="font-semibold text-white/70 text-sm">Payer Information</h2>

//                             <input
//                                 value={payerState.name}
//                                 onChange={(e) => setPayerState({ ...payerState, name: e.target.value })}
//                                 placeholder="Payer Name"
//                                 className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
//                             />
//                             {errorText("payerName")}

//                             <input
//                                 value={payerState.number}
//                                 type="text"
//                                 onChange={(e) => setPayerState({ ...payerState, number: e.target.value })}
//                                 placeholder="Payer Number"
//                                 className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
//                             />
//                             {errorText("payerNumber")}

//                             <select
//                                 value={payerState.accountType}
//                                 onChange={(e) => setPayerState({ ...payerState, accountType: e.target.value })}
//                                 className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
//                             >
//                                 <option value="">Select Account Type</option>
//                                 <option value="bkash">bKash</option>
//                                 <option value="nagad">Nagad</option>
//                                 <option value="cash">Cash</option>
//                                 <option value="brac">BRAC Bank</option>
//                                 <option value="city">City Bank</option>
//                             </select>
//                             {errorText("accountType")}
//                         </div>

//                         {/* Payee (Agent) */}
//                         <div className="w-full space-y-3">
//                             <h2 className="font-semibold text-white/70 text-sm flex items-center gap-2">
//                                 Payee Information
//                                 {changedFields.length > 0 && (
//                                     <span className="text-yellow-400 text-xs font-bold">Updated</span>
//                                 )}
//                             </h2>

//                             <input
//                                 value={payeeState.name}
//                                 onChange={(e) => setPayeeState({ ...payeeState, name: e.target.value })}
//                                 placeholder="Payee Name"
//                                 className={inputClass("name")}
//                             />
//                             {errorText("payeeName")}

//                             <input
//                                 value={payeeState.accountNumber}
//                                 type="text"
//                                 onChange={(e) => setPayeeState({ ...payeeState, accountNumber: e.target.value })}
//                                 placeholder="Payee Number"
//                                 className={inputClass("accountNumber")}
//                             />
//                             {errorText("payeeNumber")}

//                             <input
//                                 value={payeeState.accountDetails}
//                                 onChange={(e) => setPayeeState({ ...payeeState, accountDetails: e.target.value })}
//                                 placeholder="Account Details"
//                                 className={inputClass("accountDetails")}
//                             />
//                             {errorText("payeeAccountDetails")}
//                         </div>
//                     </div>

//                     {/* Note Input */}
//                     <div>
//                         <label className="text-xs font-semibold text-slate-400 mb-1 block">New Payment Note</label>
//                         <textarea
//                             name="note"
//                             rows={2}
//                             placeholder="Add reference, voucher info, or note..."
//                             className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
//                         />
//                     </div>

//                     <div className="flex justify-end gap-3 pt-2">
//                         <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-300">
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={loading || Number(selectedPayment?.balance ?? 0) <= 0}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
//                         >
//                             {loading ? "Processing..." : "Confirm Payment"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default PaymentModal;



"use client";

import axiosPublic from "@/api/axios";
import useFetch from "@/hooks/useFetch";
import { showAlert } from "@/utils/swal";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTimes, FaHistory, FaStickyNote, FaExchangeAlt } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";

const PaymentModal = ({
    selectedPayment,
    handleCloseModal,
    refetchHistory,
    refetchPending,
    historyData = [],
    allMonthsData = [],
}) => {
    const { user } = useContext(AuthContext);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Adjustment states
    const [isAdjustEnabled, setIsAdjustEnabled] = useState(false);
    const [selectedAdjustMonthKey, setSelectedAdjustMonthKey] = useState("");
    const [adjustedAmount, setAdjustedAmount] = useState("");
    const [directAmount, setDirectAmount] = useState("");
    const [note, setNote] = useState("");

    // Find all overpaid months for this agent (balance < 0)
    const overpaidMonths = useMemo(() => {
        if (!Array.isArray(allMonthsData)) return [];
        return allMonthsData.filter(
            (m) =>
                m.agentEmail?.toLowerCase() === selectedPayment.agentEmail?.toLowerCase() &&
                m.monthKey !== selectedPayment.monthKey &&
                Number(m.balance ?? 0) < 0
        );
    }, [allMonthsData, selectedPayment]);

    // History for current month
    const currentMonthPayments = useMemo(() => {
        if (!Array.isArray(historyData)) return [];
        return historyData.filter(
            (p) =>
                p.agentEmail?.toLowerCase() === selectedPayment.agentEmail?.toLowerCase() &&
                p.monthKey === selectedPayment.monthKey
        );
    }, [historyData, selectedPayment]);

    // Payee
    const [payeeState, setPayeeState] = useState({ name: "", accountNumber: "", accountDetails: "" });
    // Payer
    const [payerState, setPayerState] = useState({ name: "", number: "", accountType: "" });

    const { data: paymentInfo } = useFetch(`/user/${selectedPayment.agentEmail}/payment-info`);
    const { data: lastPayment } = useFetch(`/payments/last/${selectedPayment.agentEmail}`);

    useEffect(() => {
        if (paymentInfo) {
            setPayeeState({
                name: paymentInfo.name || "",
                accountNumber: paymentInfo.accountNumber || "",
                accountDetails: paymentInfo.accountDetails || "",
            });
        }
    }, [paymentInfo]);

    useEffect(() => {
        if (lastPayment?.payer) {
            setPayerState({
                name: lastPayment.payer.name || "",
                number: lastPayment.payer.number || "",
                accountType: lastPayment.payer.accountType || "",
            });
        }
    }, [lastPayment]);

    // Detect changed payee info
    const changedFields = useMemo(() => {
        if (!lastPayment?.payee) return [];
        const changed = [];
        if (payeeState.name !== lastPayment.payee.name) changed.push("name");
        if (payeeState.accountNumber !== lastPayment.payee.number) changed.push("accountNumber");
        if (payeeState.accountDetails !== lastPayment.payee.accountDetails) changed.push("accountDetails");
        return changed;
    }, [payeeState, lastPayment]);

    // Auto calculate pre-filled adjustment amount when dropdown changes
    const handleSelectAdjustMonth = (monthKey) => {
        setSelectedAdjustMonthKey(monthKey);
        if (!monthKey) {
            setAdjustedAmount("");
            return;
        }

        const sourceMonth = overpaidMonths.find((m) => m.monthKey === monthKey);
        if (!sourceMonth) return;

        const maxRecoverable = Math.abs(Number(sourceMonth.balance || 0));
        const targetDue = Math.max(0, Number(selectedPayment.balance || 0));

        // Pre-fill maximum possible adjustment
        const prefill = Math.min(targetDue, maxRecoverable);
        setAdjustedAmount(String(prefill));

        // Remaining balance automatically set to direct cash payment
        const remaining = Math.max(0, targetDue - prefill);
        setDirectAmount(remaining > 0 ? String(remaining) : "");
    };

    const inputClass = (field) =>
        `w-full p-3 bg-gray-900 border text-white rounded-lg ${
            changedFields.includes(field) ? "border-yellow-500 bg-yellow-500/10" : "border-slate-600"
        }`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const due = Number(selectedPayment?.balance ?? 0);
        const numDirect = Number(directAmount || 0);
        const numAdjusted = isAdjustEnabled && selectedAdjustMonthKey ? Number(adjustedAmount || 0) : 0;
        const totalSettling = numDirect + numAdjusted;

        const newErrors = {};

        if (totalSettling <= 0) {
            newErrors.amount = "Please enter a direct payment or adjustment amount";
        } else if (totalSettling > due) {
            newErrors.amount = `Total settling (${totalSettling} ৳) cannot exceed balance (${due} ৳)`;
        }

        if (isAdjustEnabled && selectedAdjustMonthKey) {
            const sourceMonth = overpaidMonths.find((m) => m.monthKey === selectedAdjustMonthKey);
            const maxRecoverable = Math.abs(Number(sourceMonth?.balance || 0));
            if (numAdjusted <= 0) newErrors.adjustedAmount = "Adjustment amount must be greater than 0";
            if (numAdjusted > maxRecoverable) {
                newErrors.adjustedAmount = `Cannot exceed available overpayment (${maxRecoverable} ৳)`;
            }
        }

        // Payer / Payee validations only needed if cash/bank money is actually being sent
        // if (numDirect > 0) {
        //     if (!payerState.name) newErrors.payerName = "Payer name required";
        //     if (!payerState.number) newErrors.payerNumber = "Payer number required";
        //     if (!payerState.accountType) newErrors.accountType = "Select account type";

        //     if (!payeeState.name) newErrors.payeeName = "Payee name required";
        //     if (!payeeState.accountNumber) newErrors.payeeNumber = "Account number required";
        //     if (!payeeState.accountDetails) newErrors.payeeAccountDetails = "Account details required";
        // }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            // Update agent payment profile if direct payment used
            if (numDirect > 0) {
                await axiosPublic.put(`/user/${selectedPayment.agentEmail}/payment-info`, {
                    name: payeeState.name,
                    accountNumber: payeeState.accountNumber,
                    accountDetails: payeeState.accountDetails,
                    changedBy: user.email,
                });
            }

            const selectedSourceObj = overpaidMonths.find((m) => m.monthKey === selectedAdjustMonthKey);

            await axiosPublic.post("/payments/commissions/pay", {
                agentEmail: selectedPayment.agentEmail,
                monthKey: selectedPayment.monthKey,
                directAmount: numDirect,
                adjustedAmount: numAdjusted,
                adjustFromMonthKey: isAdjustEnabled ? selectedAdjustMonthKey : "",
                adjustFromMonthLabel: selectedSourceObj?.month || selectedAdjustMonthKey,
                method: payerState.accountType || "manual",
                note: note.trim(),
                payer: payerState,
                payee: {
                    name: payeeState.name,
                    number: payeeState.accountNumber,
                    accountDetails: payeeState.accountDetails,
                },
            });

            refetchPending();
            refetchHistory();
            handleCloseModal();
            showAlert("Success", "Payment & adjustments recorded successfully", "success");
        } catch (err) {
            showAlert("Error", err?.response?.data?.error || "Payment failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const errorText = (name) => errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#1e293b] rounded-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-700">
                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-800">
                    <h3 className="text-white font-bold">
                        Process Payment — {selectedPayment.month || selectedPayment.monthKey}
                    </h3>
                    <button onClick={handleCloseModal}>
                        <FaTimes className="text-white hover:text-red-400 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Summary Header */}
                    <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                        <div>
                            <p className="text-white font-semibold text-lg">{selectedPayment.agentName}</p>
                            <p className="text-sm text-slate-400">{selectedPayment.agentEmail}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase text-slate-400 font-semibold mb-1">Due to Agent</p>
                            <p className="text-blue-400 font-bold text-lg">
                                {Number(selectedPayment.balance ?? 0).toFixed(2)} ৳
                            </p>
                        </div>
                    </div>

                    {/* 🔥 SECTION: CROSS-MONTH ADJUSTMENT (OFFSET) 🔥 */}
                    <div className="bg-slate-900/90 rounded-lg p-4 border border-indigo-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isAdjustEnabled}
                                    onChange={(e) => {
                                        setIsAdjustEnabled(e.target.checked);
                                        if (!e.target.checked) {
                                            setSelectedAdjustMonthKey("");
                                            setAdjustedAmount("");
                                        }
                                    }}
                                    className="checkbox checkbox-sm checkbox-primary rounded"
                                />
                                <span className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
                                    <FaExchangeAlt /> Adjust from other month (Due from Agent)
                                </span>
                            </label>

                            <span className="text-xs text-slate-400">
                                {overpaidMonths.length} overpaid month(s) available
                            </span>
                        </div>

                        {isAdjustEnabled && (
                            <div className="pt-2 border-t border-slate-800 space-y-3">
                                {overpaidMonths.length === 0 ? (
                                    <p className="text-xs text-amber-400 italic">
                                        No overpaid months found for this agent.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1">
                                                Select Overpaid Month
                                            </label>
                                            <select
                                                value={selectedAdjustMonthKey}
                                                onChange={(e) => handleSelectAdjustMonth(e.target.value)}
                                                className="w-full p-2.5 bg-gray-900 border border-slate-700 text-white rounded-lg text-sm"
                                            >
                                                <option value="">-- Select Month to Adjust --</option>
                                                {overpaidMonths.map((m) => (
                                                    <option key={m.monthKey} value={m.monthKey}>
                                                        {m.month || m.monthKey} (Overpaid: {Math.abs(m.balance)} ৳)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1">
                                                Adjustment Amount (Auto-Calculated)
                                            </label>
                                            <input
                                                type="number"
                                                value={adjustedAmount}
                                                onChange={(e) => setAdjustedAmount(e.target.value)}
                                                placeholder="Amount to deduct"
                                                className="w-full p-2.5 bg-gray-900 border border-slate-700 text-white rounded-lg text-sm"
                                            />
                                            {errorText("adjustedAmount")}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Direct Payment Amount */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-slate-400">
                                Direct Cash/Bank Payment Amount {isAdjustEnabled && "(Optional if fully adjusted)"}
                            </label>
                            {isAdjustEnabled && adjustedAmount && (
                                <span className="text-xs text-slate-400">
                                    Total Settle:{" "}
                                    <strong className="text-green-400">
                                        {(Number(directAmount || 0) + Number(adjustedAmount || 0)).toFixed(2)} ৳
                                    </strong>
                                </span>
                            )}
                        </div>
                        <input
                            name="paymentAmount"
                            type="number"
                            value={directAmount}
                            onChange={(e) => setDirectAmount(e.target.value)}
                            placeholder={isAdjustEnabled ? "Direct cash amount (or 0)" : "Direct Payment Amount"}
                            className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                        />
                        {errorText("amount")}
                    </div>

                    {/* Payer & Payee - Only required if direct cash/bank is being transferred */}
                    <div className="flex gap-4">
                        {/* Payer */}
                        <div className="w-full space-y-3">
                            <h2 className="font-semibold text-white/70 text-sm">Payer Information</h2>
                            <input
                                value={payerState.name}
                                onChange={(e) => setPayerState({ ...payerState, name: e.target.value })}
                                placeholder="Payer Name"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg text-sm"
                            />
                            {errorText("payerName")}

                            <input
                                value={payerState.number}
                                type="text"
                                onChange={(e) => setPayerState({ ...payerState, number: e.target.value })}
                                placeholder="Payer Number"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg text-sm"
                            />
                            {errorText("payerNumber")}

                            <select
                                value={payerState.accountType}
                                onChange={(e) => setPayerState({ ...payerState, accountType: e.target.value })}
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg text-sm"
                            >
                                <option value="">Select Account Type</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="cash">Cash</option>
                                <option value="brac">BRAC Bank</option>
                                <option value="city">City Bank</option>
                            </select>
                            {errorText("accountType")}
                        </div>

                        {/* Payee */}
                        <div className="w-full space-y-3">
                            <h2 className="font-semibold text-white/70 text-sm flex items-center gap-2">
                                Payee Information
                                {changedFields.length > 0 && (
                                    <span className="text-yellow-400 text-xs font-bold">Updated</span>
                                )}
                            </h2>

                            <input
                                value={payeeState.name}
                                onChange={(e) => setPayeeState({ ...payeeState, name: e.target.value })}
                                placeholder="Payee Name"
                                className={inputClass("name")}
                            />
                            {errorText("payeeName")}

                            <input
                                value={payeeState.accountNumber}
                                type="text"
                                onChange={(e) => setPayeeState({ ...payeeState, accountNumber: e.target.value })}
                                placeholder="Payee Number"
                                className={inputClass("accountNumber")}
                            />
                            {errorText("payeeNumber")}

                            <input
                                value={payeeState.accountDetails}
                                onChange={(e) => setPayeeState({ ...payeeState, accountDetails: e.target.value })}
                                placeholder="Account Details"
                                className={inputClass("accountDetails")}
                            />
                            {errorText("payeeAccountDetails")}
                        </div>
                    </div>

                    {/* Note Input */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 mb-1 block">
                            Payment / Adjustment Note (Will be saved on both months)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            placeholder="Add reference, voucher info, or adjustment reason..."
                            className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg text-sm resize-none"
                        />
                    </div>

                    {/* Previous Payments for this month */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-2">
                                <FaHistory className="text-purple-400" />
                                Payment History ({selectedPayment.month || selectedPayment.monthKey})
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                                {currentMonthPayments.length} Records
                            </span>
                        </div>

                        {currentMonthPayments.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-1">No previous transactions for this month.</p>
                        ) : (
                            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                {currentMonthPayments.map((p, idx) => (
                                    <div
                                        key={p._id || idx}
                                        className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-xs space-y-1"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span
                                                className={`font-bold ${
                                                    p.amount < 0 ? "text-amber-400" : "text-green-400"
                                                }`}
                                            >
                                                {p.amount > 0 ? "+" : ""}
                                                {Number(p.amount).toFixed(2)} ৳
                                                {p.method === "adjustment" && " (Adjustment)"}
                                            </span>
                                            <span className="text-slate-400 text-[11px]">{formatDate(p.paidAt)}</span>
                                        </div>
                                        {p.note && (
                                            <div className="flex items-start gap-1 bg-slate-900/70 p-1.5 rounded text-slate-300 text-[11px]">
                                                <FaStickyNote className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span className="italic">{p.note}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-300">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || Number(selectedPayment?.balance ?? 0) <= 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                        >
                            {loading ? "Processing..." : "Confirm Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;