"use client";
import React, { useState } from "react";

const commissionSlabs = [
    { min: 50, max: 99, range: "৳50,000 – ৳99,999", rate: 1000, bonus: 0 },
    { min: 100, max: 199, range: "৳100,000 – ৳199,999", rate: 1100, bonus: 500 },
    { min: 200, max: 299, range: "৳200,000 – ৳299,999", rate: 1200, bonus: 1500 },
    { min: 300, max: 399, range: "৳300,000 – ৳399,999", rate: 1300, bonus: 3000 },
    { min: 400, max: 499, range: "৳400,000 – ৳499,999", rate: 1400, bonus: 4000 },
    { min: 500, max: 599, range: "৳500,000 – ৳599,999", rate: 1500, bonus: 6000 },
    { min: 600, max: 699, range: "৳600,000 – ৳699,999", rate: 1600, bonus: 6000 },
    { min: 700, max: 799, range: "৳700,000 – ৳799,999", rate: 1700, bonus: 10000 },
    { min: 800, max: 899, range: "৳800,000 – ৳899,999", rate: 1800, bonus: 10000 },
    { min: 900, max: 999, range: "৳900,000 – ৳999,999", rate: 1900, bonus: 10000 },
    { min: 1000, max: 1099, range: "৳1,000,000 – ৳1,099,999", rate: 2000, bonus: 15000 },
    { min: 1100, max: 1199, range: "৳1,100,000 – ৳1,199,999", rate: 2100, bonus: 15000 },
    { min: 1200, max: 1299, range: "৳1,200,000 – ৳1,299,999", rate: 2200, bonus: 15000 },
    { min: 1300, max: 1399, range: "৳1,300,000 – ৳1,399,999", rate: 2300, bonus: 15000 },
    { min: 1400, max: 1499, range: "৳1,400,000 – ৳1,499,999", rate: 2400, bonus: 15000 },
    { min: 1500, max: 1599, range: "৳1,500,000 – ৳1,599,999", rate: 2500, bonus: 25000 },
    { min: 1600, max: 1699, range: "৳1,600,000 – ৳1,699,999", rate: 2600, bonus: 25000 },
    { min: 1700, max: 1799, range: "৳1,700,000 – ৳1,799,999", rate: 2700, bonus: 25000 },
    { min: 1800, max: 1899, range: "৳1,800,000 – ৳1,899,999", rate: 2800, bonus: 25000 },
    { min: 1900, max: 1999, range: "৳1,900,000 – ৳1,999,999", rate: 2900, bonus: 25000 },
    { min: 2000, max: Infinity, range: "৳2,000,000+", rate: 2900, bonus: 40000 },
];

const CommissionGuide = () => {
    const [inputSales, setInputSales] = useState(350000);

    const calculateCommission = (sales) => {
        const numSales = Number(sales) || 0;
        if (numSales < 50000) {
            return { base: 0, bonus: 0, total: 0, rate: 0 };
        }

        const salesInK = Math.floor(numSales / 1000) ;
        const matchedSlab = commissionSlabs.find(
            (s) => salesInK >= s.min && salesInK <= s.max
        ) || commissionSlabs[commissionSlabs.length - 1];

        const rate = matchedSlab.rate;
        const base = Math.round(numSales * (rate / 100000));
        const bonus = matchedSlab.bonus;
        const total = base + bonus;

        return { base, bonus, total, rate };
    };

    const currentResult = calculateCommission(inputSales);

    return (
        <div className="min-h-screen bg-[#1a1d27] text-gray-300 font-sans p-6 md:p-10 selection:bg-blue-600 selection:text-white">
            <div className="max-w-screen-xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="border-b border-gray-700 pb-5">
                    <h1 className="text-3xl font-bold text-white mb-2">Commission & Bonus Chart</h1>
                    <p className="text-gray-400 text-sm">
                        Easily check your base commission rates and extra cash bonuses based on your total monthly sales.
                    </p>
                </div>

                {/* Interactive Live Calculator */}
                <div className="bg-[#222736] border border-blue-600/50 rounded-xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Live Estimator
                    </div>

                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">🧮</span> Test Your Earnings
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Input Box & Quick Presets */}
                        <div className="lg:col-span-5 space-y-3">
                            <label className="text-xs text-gray-400 font-medium block">
                                Enter Expected Monthly Sales (৳):
                            </label>
                            <input
                                type="number"
                                value={inputSales}
                                onChange={(e) => setInputSales(e.target.value)}
                                className="w-full bg-[#1a1d27] border border-gray-600 rounded-lg px-4 py-3 text-white text-xl font-bold font-mono focus:outline-none focus:border-blue-500"
                                placeholder="e.g. 350000"
                            />
                            <div className="flex flex-wrap gap-2 pt-1">
                                {[100000, 350000, 500000, 1000000, 2000000].map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setInputSales(preset)}
                                        className="text-xs bg-[#1a1d27] hover:bg-blue-600 hover:text-white border border-gray-700 text-gray-300 px-2.5 py-1.5 rounded transition-colors"
                                    >
                                        {(preset / 1000)}K
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Result Cards */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-[#1a1d27] p-4 rounded-lg border border-gray-700">
                                <span className="text-xs text-gray-400 block mb-1">Base Commission</span>
                                <span className="text-lg font-bold font-mono text-blue-400">
                                    ৳{currentResult.base.toLocaleString()}
                                </span>
                            </div>

                            <div className="bg-[#1a1d27] p-4 rounded-lg border border-gray-700">
                                <span className="text-xs text-gray-400 block mb-1">Extra Bonus</span>
                                <span className="text-lg font-bold font-mono text-yellow-400">
                                    +৳{currentResult.bonus.toLocaleString()}
                                </span>
                            </div>

                            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-lg text-white shadow">
                                <span className="text-xs opacity-90 block mb-1">Total Payable</span>
                                <span className="text-xl font-bold font-mono">
                                    ৳{currentResult.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Master Commission Table */}
                <div className="bg-[#222736] border border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                        <span>📊</span> Complete Sales & Bonus Table
                    </h2>

                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#2a3042] text-white font-semibold">
                                <tr>
                                    <th className="px-6 py-3.5 border-b border-gray-700">Sales Tier Range</th>
                                    <th className="px-6 py-3.5 border-b border-gray-700 text-center">Commission Rate / 100K</th>
                                    <th className="px-6 py-3.5 border-b border-gray-700 text-right">Extra Cash Bonus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/70">
                                {commissionSlabs.map((slab, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-[#2a3042]/60 transition-colors"
                                    >
                                        <td className="px-6 py-3.5 font-medium text-white">
                                            {slab.range}
                                        </td>
                                        <td className="px-6 py-3.5 text-center font-mono text-blue-400 font-bold">
                                            ৳{slab.rate.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-mono">
                                            {slab.bonus > 0 ? (
                                                <span className="inline-block bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded font-bold">
                                                    +৳{slab.bonus.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommissionGuide;