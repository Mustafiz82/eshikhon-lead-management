import React from 'react';

const CommissionGuide = () => {
    return (
        <div className="min-h-screen bg-[#1a1d27] text-gray-300 font-sans p-6 md:p-10  selection:bg-blue-600 selection:text-white">
            {/* Page Header */}
            <div className='max-w-screen-xl mx-auto'>
                <div className="mb-8 border-b border-gray-700 pb-5">
                    <h1 className="text-3xl font-bold text-white mb-2">Commission Calculation Guide</h1>
                    <p className="text-gray-400 text-sm">
                        A complete breakdown of how the monthly total commission is calculated based on sales, target completions, and self-generated leads.
                    </p>
                </div>

                {/* Main Content Layout - Full Width */}
                <div className="space-y-8 w-full">

                    {/* Introduction Panel */}
                    <div className="bg-[#222736] border border-gray-700 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-md mr-3 text-sm font-bold">
                                1
                            </span>
                            How is the Commission Calculated?
                        </h2>
                        <p className="text-sm leading-relaxed mb-4">
                            The final monthly commission is a combination of two separate parts:
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 bg-[#1a1d27] p-4 rounded border border-gray-700">
                                <span className="block text-blue-500 font-bold mb-1">Part A: Self-Created Commission</span>
                                <p className="text-xs text-gray-400">Earned from leads that are directly created and successfully enrolled by the agent.</p>
                            </div>
                            <div className="flex items-center justify-center text-gray-500 font-bold text-xl">+</div>
                            <div className="flex-1 bg-[#1a1d27] p-4 rounded border border-gray-700">
                                <span className="block text-green-500 font-bold mb-1">Part B: Assigned Commission</span>
                                <p className="text-xs text-gray-400">Earned from system-assigned leads, based on achieving the required target completion rate.</p>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-gray-400 italic">
                            * Note: All calculations are strictly based on the payments successfully collected within the selected month.
                        </p>
                    </div>

                    {/* Self Created Commission Section */}
                    <div className="bg-[#222736] border border-gray-700 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                            Part A: Self-Created Lead Commission
                        </h2>
                        <p className="text-sm mb-4">
                            For self-created leads, the commission rate increases based on the <strong>total number of those leads that successfully enroll</strong> during the month. The percentage is applied to the total sales (paid amount) generated from those specific leads.
                        </p>

                        <div className="overflow-x-auto rounded border border-gray-700">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#2a3042] text-white">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-700">Total Enrolled Leads (Self-Created)</th>
                                        <th className="px-6 py-3 border-b border-gray-700">Commission Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">1 to 50 Leads</td>
                                        <td className="px-6 py-4 text-blue-400 font-medium">0.50%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">51 to 100 Leads</td>
                                        <td className="px-6 py-4 text-blue-400 font-medium">0.75%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">101 to 200 Leads</td>
                                        <td className="px-6 py-4 text-blue-400 font-medium">1.00%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">More than 200 Leads</td>
                                        <td className="px-6 py-4 text-blue-400 font-medium">1.50%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Assigned Commission Section */}
                    <div className="bg-[#222736] border border-gray-700 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                            Part B: Assigned Lead Commission
                        </h2>
                        <p className="text-sm mb-6">
                            For leads assigned by the system or administration, the commission depends entirely on the <strong>Target Completion Rate</strong>. This requires determining a base target amount first.
                        </p>

                        <div className="flex flex-col lg:flex-row gap-6 mb-8">
                            {/* Step 1: Base Target Amount */}
                            <div className="flex-1 bg-[#1a1d27] rounded border border-blue-900/50 p-5">
                                <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
                                    <span className=" w-fit  text-blue-400 p-1 h-6 flex items-center justify-center rounded-full  text-xs font-bold">
                                        Step 1 :</span>Calculating the Target Amount
                                </h3>
                                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                    Every assigned lead is associated with an interested or enrolled course, which has a specific base price. The system calculates the total sum of the course prices for all enrolled assigned leads. The <strong>Target Amount</strong> is exactly 10% of this total sum.
                                </p>
                                <code className="block bg-[#11131a] p-3 rounded text-blue-400 text-xs text-center border border-gray-800 font-mono mt-auto">
                                    Target Amount = (Sum of Assigned Course Prices) × 10%
                                </code>
                            </div>

                            {/* Step 2: Target Completion */}
                            <div className="flex-1 bg-[#1a1d27] rounded border border-green-900/50 p-5">
                                <h3 className="text-white text-sm font-semibold mb-3 flex items-center">

                                    <span className=" w-fit  text-green-400 p-1 h-6 flex items-center justify-center rounded-full  text-xs font-bold">
                                        Step 2 :</span> Calculating Target Completion
                                </h3>
                                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                    Once the Target Amount is established, the completion rate is determined by comparing the actual <strong>Assigned Sales</strong> (payments successfully collected from assigned leads) against the calculated Target Amount.
                                </p>
                                <code className="block bg-[#11131a] p-3 rounded text-green-400 text-xs text-center border border-gray-800 font-mono mt-auto">
                                    Completion Rate = (Total Assigned Sales / Target Amount) × 100
                                </code>
                            </div>
                        </div>

                        <h3 className="text-white text-sm font-semibold mb-3">Commission Percentage Tiers</h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Based on the calculated Completion Rate (Step 2), a percentage is selected and multiplied by the Total Assigned Sales to find the final Assigned Commission.
                        </p>

                        <div className="overflow-x-auto rounded border border-gray-700">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#2a3042] text-white">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-700">Target Completion Rate</th>
                                        <th className="px-6 py-3 border-b border-gray-700">Commission Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">Less than 40%</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">0% (No commission)</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">40% to 60%</td>
                                        <td className="px-6 py-4 text-green-400 font-medium">1.00%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">61% to 80%</td>
                                        <td className="px-6 py-4 text-green-400 font-medium">1.50%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">81% to 90%</td>
                                        <td className="px-6 py-4 text-green-400 font-medium">2.00%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">91% to 100%</td>
                                        <td className="px-6 py-4 text-green-400 font-medium">2.50%</td>
                                    </tr>
                                    <tr className="hover:bg-[#2a3042] transition-colors">
                                        <td className="px-6 py-4">Over 100%</td>
                                        <td className="px-6 py-4 text-green-400 font-medium">3.00%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Formula */}
                    <div className="bg-gradient-to-r from-blue-900/40 to-[#222736] border border-blue-800/50 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">Total Monthly Commission</h2>
                        <p className="text-sm text-gray-300">
                            At the end of the month, the total payout is calculated precisely as:
                        </p>
                        <div className="mt-4 text-lg md:text-2xl font-mono text-white tracking-wider flex flex-wrap items-center justify-center gap-3">
                            <span className="text-blue-400 bg-blue-900/30 px-4 py-2 rounded border border-blue-800/50">Self-Created Commission</span>
                            <span>+</span>
                            <span className="text-green-400 bg-green-900/30 px-4 py-2 rounded border border-green-800/50">Assigned Commission</span>
                        </div>
                    </div>

                </div>



                {/* Comprehensive Example Section */}
                <div className="bg-[#222736] mt-10 border border-gray-700 rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Practical Calculation Example
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Below is a practical scenario using dashboard numbers to demonstrate how the formulas are applied.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Example: Part A */}
                        <div className="bg-[#1a1d27] rounded border border-gray-700 p-5">
                            <h3 className="text-white text-sm font-semibold mb-3 text-blue-400">Scenario A: Self-Created Leads</h3>
                            <ul className="text-sm text-gray-300 space-y-2 mb-4">
                                <li><span className="text-gray-500">Total Enrolled Leads:</span> 55 Leads</li>
                                <li><span className="text-gray-500">Total Sales Collected:</span> ৳50,000</li>
                            </ul>
                            <div className="bg-[#11131a] p-3 rounded text-xs border border-gray-800 space-y-2">
                                <p><strong className="text-gray-400">1. Identify Tier:</strong> 55 leads falls into the 51-100 tier (0.75%).</p>
                                <p><strong className="text-gray-400">2. Calculate:</strong> ৳50,000 × 0.75% = <strong className="text-white text-sm inline-block ml-1">৳375.00</strong></p>
                            </div>
                        </div>

                        {/* Example: Part B */}
                        <div className="bg-[#1a1d27] rounded border border-gray-700 p-5">
                            <h3 className="text-white text-sm font-semibold mb-3 text-green-400">Scenario B: Assigned Leads</h3>
                            <ul className="text-sm text-gray-300 space-y-2 mb-4">
                                <li><span className="text-gray-500">Total Target Amount:</span> ৳246,295 <span className="text-[10px] text-gray-600">(10% of total assigned course prices)</span></li>
                                <li><span className="text-gray-500">Total Sales Collected:</span> ৳212,169</li>
                            </ul>
                            <div className="bg-[#11131a] p-3 rounded text-xs border border-gray-800 space-y-2">
                                <p><strong className="text-gray-400">1. Completion Rate:</strong> (৳212,169 / ৳246,295) × 100 = <strong>86%</strong>.</p>
                                <p><strong className="text-gray-400">2. Identify Tier:</strong> 86% falls into the 81% to 90% tier (2.00%).</p>
                                <p><strong className="text-gray-400">3. Calculate:</strong> ৳212,169 × 2.00% = <strong className="text-white text-sm inline-block ml-1">৳4,243.38</strong></p>
                            </div>
                        </div>
                    </div>

                    {/* Example: Final Result */}
                    <div className="bg-gray-800/50 rounded border border-gray-600 p-4 flex flex-col md:flex-row items-center justify-between">
                        <span className="text-white font-medium mb-2 md:mb-0">Total Final Commission for the Month:</span>
                        <div className="font-mono text-lg flex items-center space-x-2">
                            <span className="text-blue-400">৳375.00</span>
                            <span className="text-gray-500">+</span>
                            <span className="text-green-400">৳4,243.38</span>
                            <span className="text-gray-500">=</span>
                            <span className="text-white font-bold bg-green-600 px-3 py-1 rounded shadow">৳4,618.38</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommissionGuide;