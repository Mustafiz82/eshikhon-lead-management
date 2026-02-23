import axiosPublic from '@/api/axios';
import useFetch from '@/hooks/useFetch';
import { showAlert } from '@/utils/swal';
import React, { useContext, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const PaymentModal = ({
    selectedPayment,
    handleCloseModal,
    refetchHistory,
    refetchPending
}) => {

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { data: prevPayData, loading: prevPayDataLoading, refetch } = useFetch(`/payments/last/${selectedPayment.agentEmail}`)

    console.log(prevPayData)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const newErrors = {};

        const amount = Number(data.paymentAmount);
        const due = Number(selectedPayment?.commissionDue ?? 0);

        // Simple validation
        if (!data.paymentAmount)
            newErrors.paymentAmount = "Amount is required";

        else if (amount <= 0)
            newErrors.paymentAmount = "Amount must be greater than 0";

        else if (amount > due)
            newErrors.paymentAmount = "Amount cannot exceed total due";

        if (!data.payerName)
            newErrors.payerName = "Payer name required";

        if (!data.payerNumber)
            newErrors.payerNumber = "Payer number required";

        if (!data.accountType)
            newErrors.accountType = "Select account type";

        if (!data.payeeName)
            newErrors.payeeName = "Payee name required";

        if (!data.payeeNumber)
            newErrors.payeeNumber = "Payee number required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await axiosPublic.post("/payments/commissions/pay", {
                agentEmail: selectedPayment.agentEmail,
                monthKey: selectedPayment.monthKey,
                amount,
                method: "manual",

                payer: {
                    name: data.payerName,
                    number: data.payerNumber,
                    accountType: data.accountType,
                },

                payee: {
                    name: data.payeeName,
                    number: data.payeeNumber,
                    accountDetails: data.payeeAccountDetails,
                }
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


                    {/* Summary */}
                    <div className="flex justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-white font-semibold text-lg">
                                {selectedPayment.agentName}
                            </p>
                            <p className="text-sm text-slate-400">
                                {selectedPayment.agentEmail}
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">
                                Month
                            </p>
                            <p className="text-white text-sm bg-slate-800 p-2 rounded">
                                {selectedPayment.month}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">
                                Total Due
                            </p>
                            <p className="text-blue-400 font-bold text-sm bg-slate-800 p-2 rounded">
                                {Number(selectedPayment.commissionDue ?? 0).toFixed(2)} ৳
                            </p>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <input
                            name="paymentAmount"
                            type="number"
                            placeholder="Payment Amount"
                            className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                        />
                        {errorText("paymentAmount")}
                    </div>

                    <div className="flex gap-4">

                        {/* Payer */}
                        <div className="w-full space-y-3">

                            <h2 className='font-semibold text-white/70'>Payer Information</h2>
                            <input
                                name="payerName"
                                value={prevPayData?.payer?.name}
                                placeholder="Payer Name"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
                            {errorText("payerName")}

                            <input
                                name="payerNumber"
                                value={prevPayData?.payer?.number}
                                placeholder="Payer Number"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
                            {errorText("payerNumber")}

                            <select
                                name="accountType"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                                value={prevPayData?.payer?.accountType}
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
                             <h2 className='font-semibold text-white/70'>Payee Information</h2>
                            <input
                                name="payeeName"
                                defaultValue={selectedPayment.agentName}
                                placeholder="Payee Name"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
                            {errorText("payeeName")}

                            <input
                                name="payeeNumber"
                                value={prevPayData?.payee?.number}
                                placeholder="Payee Number"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
                            {errorText("payeeNumber")}

                            <input
                                name="payeeAccountDetails"
                                value={prevPayData?.payee?.accountDetails}
                                placeholder="Account Details"
                                className="w-full p-3 bg-gray-900 border border-slate-600 text-white rounded-lg"
                            />
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