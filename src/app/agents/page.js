"use client"
import AgentsLeadsStatusPanel from "@/components/agentLeads/AgentsLeadsStatusPanel";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import Leaderboard from "@/shared/Leaderboard";
import { useContext, useEffect, useState } from "react";

const Page = () => {
  const {user} = useContext(AuthContext)
  const currentMonth = new Date().getMonth() + 1;
  const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));
  

  const { data: leaderboard, loading , refetch } = useFetch(
    `/dashboard/leaderboards?month=${selectedFilter}&year=2025`
  );

  useEffect(() => {
    refetch()
  }, [selectedFilter])

  console.log(leaderboard)


  // if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6  min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-xl font-semibold capitalize">{user.name} Dashboard</h2>
        <div className="flex gap-2 items-center">
          <p className="whitespace-nowrap  text-gray-300">View Statistics for:</p>
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

      <AgentsLeadsStatusPanel selectedFilter={selectedFilter} />

      <div className="mt-10 grid grid-cols-2 gap-5">
        <Leaderboard
          title="Most Performing Agents (by Admit count)"
          data={leaderboard?.byAdmitCount || []}
          valueKey="enrolledCount"
          metricLabel="Admits"
          loading={loading}
        />

        <Leaderboard
          title="Most Performing Agents (by Sales count)"
          data={leaderboard?.bySales || []}
          valueKey="totalPaidFromEnrolled"
          metricLabel="Sales (৳)"
          loading={loading}
        />

        <Leaderboard
          title="Agents With Highest Lead Conversion Rate"
          data={leaderboard?.byConversion || []}
          valueKey="conversionRate"
          metricLabel="Conversion (%)"
          loading={loading}
        />

        <Leaderboard
          title="Target Completion by Agent"
          data={leaderboard?.byTargetFilled || []}
          valueKey="targetFilled"
          metricLabel="Completed Target (%)"
          loading={loading}
        />

      </div>
    </div>
  );
};

export default Page;
