import axiosPublic from '@/api/axios';
import { showAlert } from '@/utils/swal';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const PaymentModal = ({  selectedPayment, setPaymentAmount, handleCloseModal, paymentAmount , refetchHistory , refetchPending }) => {


    // Confirm Payment (real POST)
    const handleConfirmPayment = async () => {
        const amt = Number(paymentAmount);

        if (!Number.isFinite(amt) || amt <= 0) {

            showAlert("Please enter a valid amount", "", "error");
            return;
        }

        if (!selectedPayment?.agentEmail || !selectedPayment?.monthKey) {
            showAlert("Invalid row selected ", "", "error");
            return;
        }

        try {
            await axiosPublic.post("/payments/commissions/pay", {
                agentEmail: selectedPayment.agentEmail,
                monthKey: selectedPayment.monthKey,
                amount: amt,
                method: "manual",
                reference: "",
                note: "",
            });

            // Refresh both tables (pending + history)
            refetchPending();
            refetchHistory();

            handleCloseModal();
            showAlert(`Payment of ${amt}৳ recorded for ${selectedPayment.agentName}`, "", "success");

        } catch (err) {
            console.error(err);
            showAlert("Payment failed", err?.response?.data?.error || "Something went wrong.", "error");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-600 w-full max-w-3xl overflow-hidden transform transition-all scale-100">
                {/* Modal Header */}
                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Process Payment</h3>
                    <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">

                    {/* Agent Info (Payee Summary) */}

                    {/* Payment Summary */}
                    <div className="flex justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-white font-semibold text-lg">{selectedPayment.agentName}</p>
                            <p className="text-sm text-slate-400">{selectedPayment.agentEmail}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Month</p>
                            <p className="text-white  text-sm bg-slate-800 p-2 rounded">
                                {selectedPayment.month}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Total Due</p>
                            <p className="text-blue-400 font-bold text-sm bg-slate-800 p-2 rounded">
                                {Number(selectedPayment.commissionDue ?? 0).toFixed(2)} ৳
                            </p>
                        </div>
                    </div>

                    {/* Payment Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Payment Amount (৳)
                        </label>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full bg-gray-900 border border-slate-600 text-white rounded-lg p-3 focus:outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Payer Information */}
                    <div className="flex gap-5 text-sm">
                        <div className="border w-full border-slate-700 rounded-xl p-4 space-y-4 bg-slate-900/40">
                            <h4 className="text-white font-semibold">Payer Information</h4>

                            <input
                                type="text"
                                placeholder="Payer Name"
                                className="w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-0 bg-gray-900 border border-slate-600 text-white rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="Payer Number"
                                className="w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-0 bg-gray-900 border border-slate-600 text-white rounded-lg p-3"
                            />

                            <div className="relative w-full">
                                <select
                                    className="w-full appearance-none bg-gray-900 border border-slate-600 text-white rounded-lg p-3 pr-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-0"
                                >
                                    <option value="">Select Account Type</option>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="cash">Cash</option>
                                    <option value="brac">BRAC Bank</option>
                                    <option value="city">City Bank</option>
                                </select>

                                {/* Custom Arrow */}
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                    ▼
                                </div>
                            </div>

                        </div>

                        {/* Payee Information */}
                        <div className="border w-full border-slate-700 rounded-xl p-4 space-y-4 bg-slate-900/40">
                            <h4 className="text-white font-semibold">Payee Information</h4>

                            <input
                                type="text"
                                placeholder="Payee Name"
                                defaultValue={selectedPayment.agentName}
                                className="w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-0 bg-gray-900 border border-slate-600 text-white rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="Payee Number"
                                className="w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-0 bg-gray-900 border border-slate-600 text-white rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="Payee Account Details"
                                className="w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-0 bg-gray-900 border border-slate-600 text-white rounded-lg p-3"
                            />
                        </div>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-900/50 flex justify-end gap-3 border-t border-slate-700">
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmPayment}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all"
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;