'use client';
import { AuthContext } from '@/context/AuthContext';
import useFetch from '@/hooks/useFetch';
import { useContext } from 'react';
import CountUp from 'react-countup';






const LeadsStatusPanel = ({ selectedFilter }) => {

  const { user } = useContext(AuthContext)
  const { data: userData, loading } = useFetch(`/dashboard/admin?month=${selectedFilter}&year=2025&email=${user.email}`);


  console.log(userData)


  const stats = [
    // 1. Influx
    {
      label: "Total Leads",
      value: userData?.totalLeads,
      unit: "",
      gradient: "from-sky-700 to-cyan-400"
    },
    {
      label: "Unassigned Leads",
      value: userData?.totalUnassigned,
      unit: "",
      gradient: "from-gray-600 to-zinc-400"
    },
    {
      label: "Assigned Leads",
      value: userData?.totalAssigned,
      unit: "",
      gradient: "from-green-700 to-emerald-400"
    },
    {
      label: "Pending (Assigned)",
      value: userData?.totalPending,
      unit: "",
      gradient: "from-amber-600 to-yellow-400"
    },

    // --- NEW: Total Enrolled ---
    {
      label: "Total Enrolled",
      value: userData?.totalEnrolled,
      unit: "",
      gradient: "from-green-800 to-teal-500" // Distinct green for success
    },

    // Status/Performance
    {
      label: "Unreachable",
      value: userData?.totalUnreachable,
      unit: "",
      gradient: "from-red-600 to-orange-400"
    },
    {
      label: "Joined Seminar",
      value: userData?.joinedOnSeminar,
      unit: "",
      gradient: "from-indigo-600 to-blue-500"
    },

    // Financials
    {
      label: "Total Sales",
      value: userData?.totalSales,
      unit: "Tk",
      gradient: "from-teal-700 to-lime-400"
    },
    {
      label: "Total Target",
      value: userData?.targetAmount,
      unit: "Tk",
      gradient: "from-blue-700 to-cyan-500"
    },
    {
      label: "Total Commission",
      value: userData?.commission,
      unit: "Tk",
      gradient: "from-purple-700 to-violet-500"
    },
    {
      label: "Total Due",
      value: userData?.totalDue,
      unit: "Tk",
      gradient: "from-pink-700 to-rose-500"
    },
    {
      label: "Total Refunds",
      value: userData?.totalRefunds,
      count: userData?.refundedCount ,
      unit: "Tk",
      gradient: "from-slate-700 to-red-500"
    }
  ];



  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-md p-4 text-white shadow-sm bg-gradient-to-r ${item.gradient} ${(stats?.length - 1) == index && "col-span-2 lg:col-span-1"}`}
        >
          <p className="text-sm font-medium mb-1"> {item.label} {item?.unit && <span>({item.unit})</span>}</p>
          {
            loading ? <p className='animate-pulse py-2'> counting... </p> : <div className="text-3xl font-bold flex items-center gap-2">
              {/* The Main Value (Amount) */}
              <span>
                <CountUp end={item.value || 0} duration={1.5} separator="," />
              </span>

              {/* The Secondary Count (inside parentheses) */}
              {item.count !== undefined && (
                <span  className="text-lg  ">
                  (<CountUp end={item.count || 0} duration={1.5} className='z-1' separator="," />)
                </span>
              )}
            </div>
          }
        </div>
      ))}
    </div>
  );
};

export default LeadsStatusPanel;


