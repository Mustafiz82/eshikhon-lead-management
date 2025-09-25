"use client"
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";

const CallCountTable = () => {
    // sample data
    const agents = [
        { name: "Agent 1", calls: [45, 60, 60, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
        { name: "Agent 2", calls: [12, 18, 25, 30, 42, 55, 20, 19, 22, 30, 28, 29, 31, 25, 30, 45, 32, 38, 41, 47, 50, 29, 24, 27, 33, 44, 39, 28, 25, 29] },
        { name: "Agent 3", calls: [8, 14, 20, 16, 18, 22, 25, 29, 24, 28, 30, 35, 38, 30, 32, 40, 42, 39, 34, 37, 41, 45, 43, 32, 29, 33, 35, 30, 28, 26] }
    ];

    const days = Array.from({ length: 30 }, (_, i) => i + 1);


    
    
    
    
    const currentMonth = new Date().getMonth() + 1;
    const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));
    const {data:callCount , refetch}   = useFetch(`/dashboard/getDailyCallCount?month=${selectedFilter}&year=2025`)
    console.log(callCount)


    useEffect(() => {
        refetch()
    } , [selectedFilter])

    return (
        <div className="mt-24 overflow-x-auto">

            <div className="flex justify-between mt-10 mb-6 items-center gap-5">
                <h2 className="text-xl font-semibold ">Daily Connected Call Count per Agent</h2>
                <div className="flex gap-2 items-center">
                    <p className="whitespace-nowrap text-gray-300">View Call Count for:</p>
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="select min-w-xs select-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
                    >
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
            </div>
            <div className="w-full">
                <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md text-sm">
                    <thead className="bg-slate-800 text-white sticky top-0">
                        <tr>
                            <th className="border border-gray-300 px-3 py-2 text-left">Agent/Day</th>
                            {days.map((day) => (
                                <th key={day} className="border border-gray-300 px-3 py-2">
                                    {day.toString().padStart(2, "0")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {callCount?.map((agent, idx) => (
                            <tr className="" key={idx} >
                                <td className="border border-gray-300 px-3 bg-slate-800 py-2 font-semibold">{agent.name}</td>
                                {agent.calls.map((count, i) => (
                                    <td key={i} className="border hover:bg-slate-700 border-gray-300 px-3 py-2 text-center">
                                        {count}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallCountTable;
