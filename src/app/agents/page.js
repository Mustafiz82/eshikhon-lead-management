"use client"
import AgentsLeadsStatusPanel from "@/components/agentLeads/AgentsLeadsStatusPanel";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import Leaderboard from "@/shared/Leaderboard";
import CustomSelect from "@/utils/CustomSelect";
import { useContext, useEffect, useState } from "react";

const Page = () => {
  const { user } = useContext(AuthContext)
  const currentMonth = new Date().getMonth() + 1;
  const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));


  const { data: leaderboard, loading, refetch } = useFetch(
    `/dashboard/leaderboards?month=${selectedFilter}&year=2025`
  );




  // if (loading) return <p className="text-white">Loading...</p>;


  
    const options = [
            { value: "all", label: "All Time" },
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
    <div className="p-6  min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-xl font-semibold capitalize">{user.name} Dashboard</h2>
        <div className="flex gap-2 items-center">
          <p className="whitespace-nowrap hidden lg:block text-gray-300">View Statistics for:</p>
          


          <CustomSelect 
            selected={selectedFilter}
            setSelected={setSelectedFilter}
            options={options}

          />
        </div>
      </div>

      <AgentsLeadsStatusPanel selectedFilter={selectedFilter} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
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
          metricLabel=" Target (%)"
          loading={loading}
        />

      </div>
    </div>
  );
};

export default Page;
