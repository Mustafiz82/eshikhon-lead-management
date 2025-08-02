import LeadsGrowthChart from "@/components/Dashboard/LeadsGrowthChart";
import LeadsStatusPanel from "@/components/Dashboard/LeadsStatusPanel";
import SeminarPieChart from "@/components/Dashboard/SeminarPieChart";
import React from "react";

const page = () => {
    return <div className="p-6">
       <LeadsStatusPanel/>
        <LeadsGrowthChart />
        {/* <SeminarPieChart/> */}
    </div>
}

export default page 