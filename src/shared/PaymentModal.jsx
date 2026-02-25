"use client";

import axiosPublic from "@/api/axios";
import useFetch from "@/hooks/useFetch";
import { showAlert } from "@/utils/swal";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";

const PaymentModal = ({
    selectedPayment,
    handleCloseModal,
    refetchHistory,
    refetchPending,
}) => {
    const { user } = useContext(AuthContext);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // -------------------------------
    // PAYEE (Agent Profile - Canonical)
    // -------------------------------
    const [payeeState, setPayeeState] = useState({
        name: "",
        accountNumber: "",
        accountDetails: "",
    });

    // -------------------------------
    // PAYER (Admin)
    // -------------------------------
    const [payerState, setPayerState] = useState({
        name: "",
        number: "",
        accountType: "",
    });

    // Fetch canonical payment profile
    const { data: paymentInfo } = useFetch(
        `/user/${selectedPayment.agentEmail}/payment-info`
    );

    // Fetch last payment snapshot for diff
    const { data: lastPayment } = useFetch(
        `/payments/last/${selectedPayment.agentEmail}`
    );

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


    console.log(lastPayment)
    console.log(payeeState)

    // Detect changed fields compared to last snapshot
    const changedFields = useMemo(() => {
        if (!lastPayment?.payee) return [];

        const changed = [];

        if (payeeState.name !== lastPayment.payee.name)
            changed.push("name");

        if (payeeState.accountNumber !== lastPayment.payee.number)
            changed.push("accountNumber");

        if (payeeState.accountDetails !== lastPayment.payee.accountDetails)
            changed.push("accountDetails");

        return changed;
    }, [payeeState, lastPayment]);

    const inputClass = (field) =>
        `w-full p-3 bg-gray-900 border text-white rounded-lg ${changedFields.includes(field)
            ? "border-yellow-500 bg-yellow-500/10"
            : "border-slate-600"
        }`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const amount = Number(formData.get("paymentAmount"));
        const due = Number(selectedPayment?.balance ?? 0);

        const newErrors = {};

        if (!amount) newErrors.paymentAmount = "Amount required";
        else if (amount <= 0)
            newErrors.paymentAmount = "Amount must be greater than 0";
        else if (amount > due)
            newErrors.paymentAmount = "Amount cannot exceed remaining balance";

        if (!payerState.name) newErrors.payerName = "Payer name required";
        if (!payerState.number) newErrors.payerNumber = "Payer number required";
        if (!payerState.accountType)
            newErrors.accountType = "Select account type";

        if (!payeeState.name) newErrors.payeeName = "Payee name required";
        if (!payeeState.accountNumber)
            newErrors.payeeNumber = "Account number required";
        if (!payeeState.accountDetails)
            newErrors.payeeAccountDetails = "Account details required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            // 1️⃣ Update agent profile if admin edited
            await axiosPublic.put(
                `/user/${selectedPayment.agentEmail}/payment-info`,
                {
                    name: payeeState.name,
                    accountNumber: payeeState.accountNumber,
                    accountDetails: payeeState.accountDetails,
                    changedBy: user.email,
                }
            );

            // 2️⃣ Create payment (snapshot stored backend)
            await axiosPublic.post("/payments/commissions/pay", {
                agentEmail: selectedPayment.agentEmail,
                monthKey: selectedPayment.monthKey,
                amount,
                method: "manual",

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

            showAlert("Success", "Payment recorded", "success");
        } catch (err) {
            showAlert(
                "Error",
                err?.response?.data?.error || "Payment failed",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const errorText = (name) =>
        errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        );


    console.log(changedFields)



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#1e293b] rounded-xl w-full max-w-3xl">
                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold">Process Payment</h3>
                    <button onClick={handleCloseModal}>
                        <FaTimes className="text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Summary (unchanged) */}
                    <div className="flex justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-white font-semibold text-lg">
                                {selectedPayment.agentName}
                            </p>
                            <p className="text-sm text-slate-400">
                                {selectedPayment.agentEmail}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">
                                Remaining Balance
                            </p>
                            <p className="text-blue-400 font-bold text-sm bg-slate-800 p-2 rounded">
                                {Number(selectedPayment.balance ?? 0).toFixed(2)} ৳
                            </p>
                        </div>
                    </div>

                    {/* Amount */}
                    <input
                        name="paymentAmount"
                        type="number"
                        placeholder="Payment Amount"
                        className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                    />
                    {errorText("paymentAmount")}

                    <div className="flex gap-4">
                        {/* Payer (Admin) */}
                        <div className="w-full space-y-3">
                            <h2 className="font-semibold text-white/70">
                                Payer Information
                            </h2>

                            <input
                                value={payerState.name}
                                onChange={(e) =>
                                    setPayerState({ ...payerState, name: e.target.value })
                                }
                                placeholder="Payer Name"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
                            {errorText("payerName")}

                            <input
                                value={payerState.number}
                                onChange={(e) =>
                                    setPayerState({ ...payerState, number: e.target.value })
                                }
                                placeholder="Payer Number"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
                            {errorText("payerNumber")}

                            <select
                                value={payerState.accountType}
                                onChange={(e) =>
                                    setPayerState({
                                        ...payerState,
                                        accountType: e.target.value,
                                    })
                                }
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
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

                        {/* Payee (Agent) */}
                        <div className="w-full space-y-3">
                            <h2 className="font-semibold text-white/70 flex items-center gap-2">
                                Payee Information
                                {changedFields.length > 0 && (
                                    <span className="text-yellow-400 text-xs font-bold">
                                        Updated Since Last Payment
                                    </span>
                                )}
                            </h2>

                            <input
                                value={payeeState.name}
                                onChange={(e) =>
                                    setPayeeState({ ...payeeState, name: e.target.value })
                                }
                                placeholder="Payee Name"
                                className={inputClass("name")}
                            />
                            {errorText("payeeName")}

                            <input
                                value={payeeState.accountNumber}
                                onChange={(e) =>
                                    setPayeeState({
                                        ...payeeState,
                                        accountNumber: e.target.value,
                                    })
                                }
                                placeholder="Payee Number"
                                className={inputClass("accountNumber")}
                            />
                            {errorText("payeeNumber")}

                            <input
                                value={payeeState.accountDetails}
                                onChange={(e) =>
                                    setPayeeState({
                                        ...payeeState,
                                        accountDetails: e.target.value,
                                    })
                                }
                                placeholder="Account Details"
                                className={inputClass("accountDetails")}
                            />
                            {errorText("payeeAccountDetails")}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-slate-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
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