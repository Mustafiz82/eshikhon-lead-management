"use client"
import CallCountTable from "@/components/Dashboard/CallCountTable";
import LeadsGrowthChart from "@/components/Dashboard/LeadsGrowthChart";
import LeadsStatusPanel from "@/components/Dashboard/LeadsStatusPanel";
import SeminarPieChart from "@/components/Dashboard/SeminarPieChart";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import Leaderboard from "@/shared/Leaderboard";
import React, { useContext, useEffect, useState } from "react";

const page = () => {


    const currentMonth = new Date().getMonth() + 1;
    const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));
    const { user } = useContext(AuthContext)

    const { data: leaderboard, loading, refetch } = useFetch(
        `/dashboard/leaderboards?month=${selectedFilter}&year=2025`
    );

    useEffect(() => {
        refetch()
    }, [selectedFilter])

    console.log(selectedFilter)


    if (loading) return <p className="text-white">Loading...</p>;



    return <div className="">
        <div className="flex p-6 sticky top-0 bg-slate-900 justify-between mb-4">
            <h2 className="text-white text-xl font-semibold capitalize">{user.name} Dashboard</h2>
            <div className="flex gap-2 items-center">
                <p className="whitespace-nowrap text-gray-300">View Statistics for:</p>
                <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="select min-w-xs select-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
                >
                    <option value="all">All Time</option>
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

        <div className="p-6 pt-0">
            <LeadsStatusPanel selectedFilter={selectedFilter} />
            <LeadsGrowthChart />
            <CallCountTable />
            {/* <SeminarPieChart/> */}
            <div className="mt-20 grid grid-cols-2 gap-5">
                <Leaderboard
                    title="Most Performing Agents (by Admit count)"
                    data={leaderboard?.byAdmitCount || []}
                    valueKey="enrolledCount"
                    metricLabel="Admits"
                />

                <Leaderboard
                    title="Most Performing Agents (by Sales count)"
                    data={leaderboard?.bySales || []}
                    valueKey="totalPaidFromEnrolled"
                    metricLabel="Sales (৳)"
                />

                <Leaderboard
                    title="Agents With Highest Lead Conversion Rate"
                    data={leaderboard?.byConversion || []}
                    valueKey="conversionRate"
                    metricLabel="Conversion (%)"
                />

                <Leaderboard
                    title="Target Completion by Agent"
                    data={leaderboard?.byTargetFilled || []}
                    valueKey="targetFilled"
                    metricLabel="Completed Target (%)"
                />
            </div>

        </div>
    </div>
}

export default page 