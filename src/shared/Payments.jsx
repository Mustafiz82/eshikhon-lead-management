"use client";

import useFetch from "@/hooks/useFetch";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaMoneyBillWave, FaHistory, FaTimes, FaInfo, FaInfoCircle } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import PaymentHistory from "./PaymentHistory";
import PaymentModal from "./PaymentModal";
import PaymentDue from "./PaymentDue";
import UpdatePaymentInfoModal from "./UpdatePaymentInfoModal";
import Link from "next/link";



const Page = () => {
    // --- State ---
    const [selectedAgent, setSelectedAgent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null); // row being paid
    const [paymentAmount, setPaymentAmount] = useState("");
    const { user } = useContext(AuthContext)
    const [isUpdateInfoOpen, setIsUpdateInfoOpen] = useState(false);

    useEffect(() => {
        if (user && user.role !== "admin") {
            setSelectedAgent(user.email)
        }
    }, [user])


    // --- Fetch: pending/overview rows (this includes status/balance) ---
    const shouldFetch = user && (user.role === "admin" || selectedAgent);

    const {
        data: PENDING_PAYMENTS_DATA = [],
        loading,
        refetch: refetchPending,
    } = useFetch(
        shouldFetch
            ? `/payments/commissions${selectedAgent ? `?email=${encodeURIComponent(selectedAgent)}` : ""}`
            : null
    );

    // --- Fetch: agents list ---
    const { data: AGENTS = [] } = useFetch("/user");


    const historyPath = useMemo(() => {
        if (!selectedAgent) return "/payments/commissions/history";
        return `/payments/commissions/history?agentEmail=${encodeURIComponent(selectedAgent)}`;
    }, [selectedAgent]);

    const {
        data: historyData = [],
        loading: historyLoading,
        refetch: refetchHistory,
    } = useFetch(historyPath);


    const handleFilterChange = (e) => {
        const email = e.target.value;
        setSelectedAgent(email);
        console.log("Filter selected for Agent Email:", email);
        // useFetch will auto refetch because `historyPath` and pending path change
    };

    // Open Modal
    const handleOpenPayModal = (paymentRow) => {
        setSelectedPayment(paymentRow);

        // default to remaining balance (best for partial payments)
        const defaultAmt =
            paymentRow?.balance !== undefined && paymentRow?.balance !== null
                ? paymentRow.balance
                : paymentRow?.commissionDue;

        setPaymentAmount(defaultAmt !== undefined && defaultAmt !== null ? String(defaultAmt) : "");
        setIsModalOpen(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null);
        setPaymentAmount("");
    };


    const handleOpenUpdateInfo = () => {
        setIsUpdateInfoOpen(true);
    };

    const handleCloseUpdateInfo = () => {
        setIsUpdateInfoOpen(false);
    };


    useEffect(() => {
        refetchPending()
    }, [user.role])






    return (
        <div className="min-h-screen bg-gray-900 text-slate-200 p-6 font-sans">
            {/* Header & Filter Section */}
            {
                user.role === "admin" && <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Manage Payments</h1>
                        <p className="text-sm text-slate-400">Overview of commissions and payment history</p>
                    </div>

                    <select
                        name="authority"
                        className="select px-2 w-68 bg-gray-900 focus:outline-0 focus:border-blue-500"
                        value={selectedAgent}
                        onChange={handleFilterChange}
                        required
                    >
                        <option value="">All Agents</option>
                        {AGENTS.map((agent) => (
                            <option key={agent._id || agent.id || agent.email} value={agent.email}>
                                ({agent.email})
                            </option>
                        ))}
                    </select>
                </div>
            }

            {/* SECTION 1: Pending Payments */}
            <div className="mb-10">
                <div className="flex items-center gap-2 justify-between">
                    <div className="flex flex-1 items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                            <FaMoneyBillWave />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Pending Payments</h2>
                        <Link href={`/${user.role === "admin" ? "admin" : "agents"}/docs/agent_commission_guide`}>  <FaInfoCircle className="text-lg " title=" Learn How Commission Is calculated"></FaInfoCircle></Link>
                    </div>



                    {
                        user.role !== "admin" ? <button
                            onClick={handleOpenUpdateInfo}
                            className="px-4 cursor-pointer py-2 rounded text-xs font-medium transition-colors shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                        >
                            Update Payment Info
                        </button> : null
                    }

                </div>
                <PaymentDue
                    PENDING_PAYMENTS_DATA={PENDING_PAYMENTS_DATA}
                    handleOpenPayModal={handleOpenPayModal}
                    loading={loading}
                />
            </div>

            {/* SECTION 2: Payment History (ONLY DYNAMIC) */}
            <PaymentHistory
                historyData={historyData}
                historyLoading={historyLoading}
            />

            {/* --- PAYMENT MODAL --- */}
            {isModalOpen && selectedPayment && (
                <PaymentModal
                    handleCloseModal={handleCloseModal}
                    selectedPayment={selectedPayment}
                    setPaymentAmount={setPaymentAmount}
                    paymentAmount={paymentAmount}
                    refetchPending={refetchPending}
                    refetchHistory={refetchHistory}
                />
            )}

            {isUpdateInfoOpen && (
                <UpdatePaymentInfoModal
                    handleClose={handleCloseUpdateInfo}
                />
            )}
        </div>
    );
};

export default Page;
