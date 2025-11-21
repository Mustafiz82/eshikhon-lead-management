
import { AuthContext } from '@/context/AuthContext';
import useFetch from '@/hooks/useFetch';
import { useContext, useEffect } from 'react';
import CountUp from 'react-countup';




const AgentsLeadsStatusPanel = ({ selectedFilter }) => {

  const { user } = useContext(AuthContext)
  const { data: userData, refetch, loading } = useFetch(`/dashboard/agent?month=${selectedFilter}&year=2025&email=${user.email}`);


  

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
      value: userData?.totalConnectedCallCount,
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
      value: userData?.enrolledCount,
      unit: "",
      gradient: "from-green-700 to-emerald-400" // Green = growth, success
    },

    // 9. Achievement → sales
    {
      label: "Total Sales",
      value: userData?.totalPaidFromEnrolled,
      unit: "Tk",
      gradient: "from-teal-700 to-lime-400" // Teal/lime = money, prosperity
    },

    // 10. Target set
    {
      label: "Target Amount",
      value: userData?.targetAmount,
      unit: "Tk",
      gradient: "from-blue-700 to-cyan-500" // Blue = trust, planning
    },

    // 11. Target progress
    {
      label: "Target Completion Rate",
      value: userData?.targetCompletionRate,
      unit: "%",
      gradient: "from-amber-700 to-yellow-500" // Gold = progress, achievement
    },

    // 12. Final reward → commission
    {
      label: "Commission",
      value: userData?.commission,
      unit: "Tk",
      gradient: "from-purple-700 to-violet-500" // Purple = reward, luxury
    }
  ];


  console.log(userData)


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-md p-4 text-white shadow-sm bg-gradient-to-r ${item.gradient}`}
        >
          <p className="text-sm line-clamp-1 font-medium mb-1">
            {item.label} {item?.unit && <span>({item.unit})</span>}
          </p>
          {
            loading ? <p className='animate-pulse py-2'> counting... </p> : <p className="text-3xl font-bold">
              <CountUp end={item.value || 0} duration={1.5} separator="," />
            </p>
          }
        </div>
      ))}
    </div>
  );
};

export default AgentsLeadsStatusPanel;
