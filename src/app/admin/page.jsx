import LeadsGrowthChart from "@/components/Dashboard/LeadsGrowthChart";
import LeadsStatusPanel from "@/components/Dashboard/LeadsStatusPanel";
import SeminarPieChart from "@/components/Dashboard/SeminarPieChart";
import Leaderboard from "@/shared/Leaderboard";
import React from "react";

const page = () => {

    const dummyData = {
        week: [
            { name: "Shawon", admitted: 12 },
            { name: "Nafisa", admitted: 9 },
            { name: "Tuli", admitted: 7 },
            { name: "Raihan", admitted: 6 },
        ],
        month: [
            { name: "Shawon", admitted: 35 },
            { name: "Tuli", admitted: 32 },
            { name: "Nafisa", admitted: 28 },
            { name: "Raihan", admitted: 26 },
        ],
        overall: [
            { name: "Tuli", admitted: 90 },
            { name: "Shawon", admitted: 88 },
            { name: "Raihan", admitted: 75 },
            { name: "Nafisa", admitted: 70 },
        ],
    };

  

    return <div className="p-6">
        <LeadsStatusPanel />
        <LeadsGrowthChart />
        {/* <SeminarPieChart/> */}
        <div className="mt-36 grid grid-cols-2 gap-5">
            <Leaderboard title={"Most Performing Agents (by Admit count)"} dataByFilter={dummyData} />
            <Leaderboard metricLabel="Sales count" title={"Most Performing Agents (by Sales count)"} dataByFilter={dummyData} />
            <Leaderboard metricLabel="Discount(%)" title={"Agents Preserving Maximum Value"} dataByFilter={dummyData} />
            <Leaderboard metricLabel="Compledted Target (%)" title={"Target Completion by Agent"} dataByFilter={dummyData} />
        </div>
    </div>
}

export default page 