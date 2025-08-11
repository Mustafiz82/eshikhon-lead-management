"use client";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

const medalIcons = ["🥇", "🥈", "🥉"];

const Leaderboard = ({ dataByFilter , title ,  metricLabel = "Students Admitted" }) => {
  const [filter, setFilter] = useState("overall");
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    if (dataByFilter?.[filter]) {
      const sorted = [...dataByFilter[filter]].sort((a, b) => b.admitted - a.admitted);
      setDisplayData(sorted);
    }
  }, [filter, dataByFilter]);

  return (
    <div className="bg-base-200 dark:bg-gray-800 p-6 rounded-xl shadow-md w-full  mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="join">
          {["week", "month", "overall"].map((key) => (
            <button
              key={key}
              className={`btn rounded-none btn-sm  join-item ${filter === key ? "btn-primary bg-blue-600 " : "btn-outline"}`}
              onClick={() => setFilter(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-sm text-gray-600 dark:text-gray-300">
              <th>Rank</th>
              <th>Agent Name</th>
              <th className="text-right">{metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {displayData?.length > 0 ? (
              displayData.map((agent, index) => (
                <tr style={{backgroundColor : (index % 2 !== 0) && "#2C3A52"}}  key={index}>
                  <td className="font-bold text-lg">
                    {index < 3 ? `${medalIcons[index]} ${(index + 1)}` : <span className="pl-7">{index + 1}</span> }
                  </td>
                  <td>{agent.name}</td>
                  <td className="text-right font-semibold text-blue-600">
                    <CountUp end={agent.admitted} duration={1.2} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-400 py-4">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
