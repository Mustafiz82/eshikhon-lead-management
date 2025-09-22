"use client"
import LeadsGrowthChart from "@/components/Dashboard/LeadsGrowthChart";
import LeadsStatusPanel from "@/components/Dashboard/LeadsStatusPanel";
import SeminarPieChart from "@/components/Dashboard/SeminarPieChart";
import useFetch from "@/hooks/useFetch";
import Leaderboard from "@/shared/Leaderboard";
import React, { useContext, useEffect, useState } from "react";

const page = () => {

    
    const currentMonth = new Date().getMonth() + 1;
    const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));


    const { data: leaderboard, loading, refetch } = useFetch(
        `/leaderboards?month=${selectedFilter}&year=2025`
    );

    useEffect(() => {
        refetch()
    }, [selectedFilter])

    console.log(leaderboard)


    if (loading) return <p className="text-white">Loading...</p>;



    return <div className="p-6">
        <LeadsStatusPanel />
        <LeadsGrowthChart />
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

        </div>\
    </div>
}

export default page 