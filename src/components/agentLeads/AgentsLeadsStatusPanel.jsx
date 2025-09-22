
import { AuthContext } from '@/context/AuthContext';
import useFetch from '@/hooks/useFetch';
import { useContext, useEffect } from 'react';
import CountUp from 'react-countup';




const AgentsLeadsStatusPanel = ({ selectedFilter }) => {

  const { user } = useContext(AuthContext)
  const { data: userData, refetch } = useFetch(`/user?month=${selectedFilter}&year=2025&email=${user.email}`);


  useEffect(() => {
    refetch()
  } , [selectedFilter])


  const stats = [
    // 1. Start → total pool of leads
    {
      label: "Connected Calls Today",
      value: userData?.connectedCallsToday,
      unit: "",
      gradient: "from-orange-800 to-red-500",
      outOf : "/60"
    },
    {
      label: "Total Leads",
      value: userData?.leadCount,
      unit: "",
      gradient: "from-sky-800 to-cyan-500"
    },

    // 2. Pending = untouched → cold/neutral gray
    {
      label: "Pending Leads",
      value: userData?.pendingCount,
      unit: "",
      gradient: "from-zinc-700 to-gray-500"
    },

    // 3. Warm-up step → attended seminar
    {
      label: "Joined on Seminar",
      value: userData?.joinedOnSeminarCount,
      unit: "",
      gradient: "from-indigo-600 to-blue-500"
    },

    // 4. Success → enrolled
    {
      label: "Total Enrolled",
      value: userData?.enrolledCount,
      unit: "",
      gradient: "from-green-800 to-emerald-500"
    },

    // 5. Money collected
    {
      label: "Total Sales",
      value: userData?.totalPaidFromEnrolled,
      unit: "Tk",
      gradient: "from-teal-800 to-lime-500"
    },

    // 6. Target baseline
    {
      label: "Target Amount",
      value: userData?.targetAmount,
      unit: "Tk",
      gradient: "from-indigo-800 to-blue-600"
    },

    // 7. Progress rate
    {
      label: "Target Completion Rate",
      value: userData?.targetCompletionRate,
      unit: "%",
      gradient: "from-amber-700 to-yellow-500"
    },

    // 8. Final reward
    {
      label: "Commission",
      value: userData?.commission,
      unit: "Tk",
      gradient: "from-purple-800 to-violet-500"
    }
  ];


  console.log(userData)


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-md p-4 text-white shadow-sm bg-gradient-to-r ${item.gradient}`}
        >
          <p className="text-sm line-clamp-1 font-medium mb-1">
            {item.label} {item?.unit && <span>({item.unit})</span>}
          </p>
          <p className="text-3xl font-bold">
            <CountUp end={item.value || 0} duration={1.5} separator="," />{item?.outOf || ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AgentsLeadsStatusPanel;
