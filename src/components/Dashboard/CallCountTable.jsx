"use client"
import useFetch from "@/hooks/useFetch";
import CustomSelect from "@/utils/CustomSelect";
import React, { useEffect, useState } from "react";

const CallCountTable = () => {


    const currentMonth = new Date().getMonth() + 1;
    const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));
    const { data: callCount } = useFetch(`/dashboard/getDailyCallCount?month=${selectedFilter}&year=2025`)
    const daysCount = callCount?.[0]?.calls?.length || 30;
    const days = Array.from({ length: daysCount }, (_, i) => i + 1)

  
    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];


    return (
        <div className="mt-24 ">

            <div className="flex justify-between mt-10 mb-6 items-center gap-5">
                <h2 className=" lg:text-xl font-semibold ">Daily Connected Call Count per Agent</h2>
                <div className="flex gap-2 items-center">
                    <p className="whitespace-nowrap text-gray-300 hidden lg:block">View Call Count for:</p>

                    <CustomSelect
                        selected={selectedFilter}
                        setSelected={setSelectedFilter}
                        options={months}

                    />
                </div>
            </div>
            <div className="w-full overflow-x-auto z-[-1]">
                <table className="table-auto  w-full border-collapse border border-gray-300 rounded-lg shadow-md text-sm">
                    <thead className="bg-slate-800 text-white ">
                        <tr>
                            <th className="border bg-blue-600 border-gray-300 px-3 py-2 text-left">Agent/Day</th>
                            {days.map((day) => (
                                <th key={day} className="border bg-blue-600/70 border-gray-300 px-3 py-2">
                                    {day.toString().padStart(2, "0")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {callCount?.map((agent, idx) => (
                            <tr className="" key={idx} >
                                <td className="border border-gray-300 px-3 bg-slate-800 py-2 font-semibold ">{agent.name}</td>
                                {agent.calls.map((count, i) => (
                                    <td key={i} className="border hover:bg-blue-600/60 border-gray-300 px-3 py-2 text-center">
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
