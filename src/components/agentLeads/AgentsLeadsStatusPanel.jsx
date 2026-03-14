
import { AuthContext } from '@/context/AuthContext';
import useFetch from '@/hooks/useFetch';
import { Children, useContext, useEffect } from 'react';
import CountUp from 'react-countup';




const AgentsLeadsStatusPanel = ({ selectedFilter, state, setState }) => {

  const { user } = useContext(AuthContext)

  const start = new Date(state[0].startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(state[0].endDate);
  end.setHours(23, 59, 59, 999);

  // const { data: user, loading } = useFetch(
  //     `/dashboard/agent?month=${selectedFilter}&year=2025&startDate=${start.toISOString()}&endDate=${end.toISOString()}`
  // );

  const { data: userData, refetch, loading } = useFetch(`/dashboard/agent?month=${selectedFilter}&year=2025&email=${user.email}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`);




  const stats = [
    // 1. Start → Awareness / total pool
    {
      label: "Total Leads",
      value: userData?.leadCount,
      unit: "",
      gradient: "from-sky-700 to-cyan-400" // Blue = trust, clarity
    },

    // 2. Leads untouched → neutral
    {
      label: "Pending Leads",
      value: userData?.pendingCount,
      unit: "",
      gradient: "from-gray-600 to-zinc-400" // Neutral gray = inactive
    },

    // 3. Failed attempts → unreachable
    {
      label: "Unreachable",
      value: userData?.unreachableCount,
      unit: "",
      gradient: "from-red-600 to-orange-400" // Red = stop/danger
    },

    // 4. Daily effort → connected calls
    {
      label: "Connected Calls Today",
      value: userData?.connectedCallCountToday,
      unit: "",
      outOf: "/60",
      gradient: "from-orange-600 to-rose-400" // Orange = activity, energy
    },

    // 5. Workload → total follow-ups
    {
      label: "Total Follow Up",
      value: userData?.followUpCount,
      unit: "",
      gradient: "from-amber-600 to-yellow-400" // Yellow = reminder, alert
    },

    // 6. Missed deadlines → overdue
    {
      label: "Total connected Call ",
      value: userData?.totalConnectedCall,
      unit: "",
      gradient: "from-pink-700 to-rose-500" // Pink/red tone = warning
    },

    // 7. Progress milestone → attended seminar
    {
      label: "Joined on Seminar",
      value: userData?.joinedOnSeminarCount,
      unit: "",
      gradient: "from-indigo-600 to-blue-500" // Indigo/blue = learning, step forward
    },

    // 8. Success milestone → enrollment
    {
      label: "Total Enrolled",
      value: userData?.totalEnrolled,
      unit: "",
      gradient: "from-green-700 to-emerald-400" // Green = growth, success
    },

    // 9. Achievement → sales
    {
      label: "Total Sales / Target Amount (assigned)",
      value: userData?.totalSales,
      unit: "Tk",
      gradient: "from-teal-700 to-lime-600",// Teal/lime = money, prosperity
      children: (() => {
        // 1. Calculate Values cleanly
        const currentSales = userData?.totalSales || 0;
        const target = userData?.targetAmount || 0; // Prevent divide by zero
        const percentage = Math.min(100, Math.round((currentSales / target) * 100));

        return (
          <div className="flex flex-col    mt-2 h-full">
            {/* Top: Numbers with Hierarchy */}
            <div className="flex items-end justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight">
                  <CountUp end={currentSales} separator="," duration={1.5} />
                  <span className="text-lg font-normal opacity-80 ml-1">Tk</span>
                </span>
              </div>
              <div className="text-right text-sm font-medium opacity-95 mb-1.5">
                Target: <CountUp end={target} separator="," />
              </div>
            </div>




            <div className="flex w-full h-4 bg-black/20 rounded-full overflow-hidden " role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
              <div className="flex flex-col justify-center rounded-full overflow-hidden bg-white text-xs text-black text-center whitespace-nowrap transition duration-500" style={{ width: `${userData?.targetCompletionRate}%` }}>{userData?.targetCompletionRate}%</div>
            </div>

            {/* Bottom: Percentage Label */}

          </div>
        );
      })()
    },
    {
      label: "Total Sales / sell count (created)",
      value: userData?.totalSales,
      unit: "Tk",
      gradient: "from-teal-700 to-lime-600",// Teal/lime = money, prosperity
      children: (() => {
        // 1. Calculate Values cleanly
        const currentSales = userData?.totalSales || 0;
        const target = userData?.targetAmount || 0; // Prevent divide by zero
        const percentage = Math.min(100, Math.round((currentSales / target) * 100));

        return (
          <div className="flex flex-col    mt-2 h-full">
            {/* Top: Numbers with Hierarchy */}
            <div className="flex items-end justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight">
                  <CountUp end={userData?.agentCreatedSales} separator="," duration={1.5} />      <span className="text-lg font-normal opacity-80 ml-1">Tk</span>
                  <span> /</span>
                  <span> <CountUp end={userData?.agentCreatedLeadCount} separator="," duration={1.5} /></span>

                </span>
              </div>

            </div>




            {/* Bottom: Percentage Label */}

          </div>
        );
      })()
    },

    // // 10. Target set
    // {
    //   label: "Target Amount",
    //   value: userData?.targetAmount,
    //   unit: "Tk",
    //   gradient: "from-blue-700 to-cyan-500" // Blue = trust, planning
    // },

    // // 11. Target progress
    // {
    //   label: "Target Completion Rate",
    //   value: userData?.targetCompletionRate,
    //   unit: "%",
    //   gradient: "from-amber-700 to-yellow-500" // Gold = progress, achievement
    // },

    // 12. Final reward → commission
    {
      label: "Commission",
      value: userData?.commission,
      unit: "Tk",
      gradient: "from-purple-700 to-violet-500" // Purple = reward, luxury
    },
    {
      label: "Total Due",
      value: userData?.totalDue,
      unit: "Tk",
      gradient: "from-purple-700 to-violet-500" // Purple = reward, luxury
    },
    {
      label: "Total Refunds",
      value: (userData?.totalRefunds),
      count: userData.refundedCount,
      unit: "Tk",
      gradient: "from-purple-700 to-violet-500" // Purple = reward, luxury
    }
  ];


  console.log(userData)


  const renderCard = (item, index , lessPadding) => (
    <div
      key={index}
      className={`rounded-md ${lessPadding ? "p-3" : "p-4"} text-white shadow-sm bg-gradient-to-r flex flex-col  ${item.gradient}`}
    >
      <p className="text-sm line-clamp-1 font-medium ">
        {item.label} {item?.unit && <span>({item.unit})</span>}
      </p>
      {loading ? (
        <p className="animate-pulse py-2">counting...</p>
      ) : item.children ? (
        item.children
      ) : (
        <div className="text-3xl font-bold flex items-center gap-2">
          <span>
            <CountUp end={item.value || 0} duration={1.5} separator="," />
          </span>

          {item.count !== undefined && (
            <span title="Refund Count" className="text-lg font-semibold opacity-90">
              (<CountUp end={item.count || 0} duration={1.5} separator="," />)
            </span>
          )}
        </div>
      )}
    </div>
  );



  return (
    <div className="flex flex-col gap-4">

      {/* --- FIRST ROW: 7 Items --- */}
      {/* On mobile: 2 cols, iPad: 3 or 4 cols, Desktop (xl): 7 cols */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.slice(0, 7).map((item, index) => renderCard(item, index))}
      </div>

      {/* --- SECOND ROW: 6 Items --- */}
      {/* On mobile: 2 cols, iPad: 3 cols, Desktop (xl): 6 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.slice(7).map((item, index) => renderCard(item, index + 7 , true))}
      </div>

    </div>
  );
};

export default AgentsLeadsStatusPanel;




