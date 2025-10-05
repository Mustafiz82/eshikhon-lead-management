"use client";
import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";
import CountUp from "react-countup";

const medalIcons = ["/medels/gold.png", "/medels/silver.png", "/medels/bronze.png"];

const Leaderboard = ({
  data = [],
  title,
  metricLabel = "Students Admitted",
  valueKey = "enrolledCount", // 👈 default
  loading
  
}) => {


  const {user} = useContext(AuthContext)

  
  return (
    <div className="bg-gray-800 hover:bg-blue-600/20 duration-300 p-6 rounded-xl shadow-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="lg:text-xl font-semibold">{title}</h2>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 text-sm text-gray-300 font-medium px-4 py-2 border-b border-gray-700">
        <div>Rank</div>
        <div className="col-span-3">Agent Name</div>
        <div className="text-right text-nowrap">{metricLabel}</div>
      </div>

      {/* Body */}
      <div>
        {data?.length > 0 ? (
          data.map((agent, index) => (
            <div
              key={index}
              className={`grid grid-cols-5 items-center px-4 py-3 ${(user?.email == agent.email) ? "bg-blue-900/50 font-bold" : ""} `}
            >
              {/* Rank */}
              <div className="font-bold text-lg">
                {index < 3 ? (
                  <div className="flex gap-1 items-center">
                    <img className="w-7 h-7" src={medalIcons[index]} alt="" />  {index + 1}
                  </div>
                ) : (
                  <span className="pl-7">{index + 1}</span>
                )}
              </div>

              {/* Name */}
              <div className="col-span-3">{agent.name}</div>

              {/* Metric */}
              <div className="text-right font-semibold text-blue-600">
                <CountUp end={agent[valueKey] || 0} duration={1.2} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
           {loading ? "Loading..." : " No data available."} 
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
