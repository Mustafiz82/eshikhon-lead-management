'use client';
import { AuthContext } from '@/context/AuthContext';
import useFetch from '@/hooks/useFetch';
import { useContext } from 'react';
import CountUp from 'react-countup';






const LeadsStatusPanel = ({selectedFilter}) => {

  const { user } = useContext(AuthContext)
  const { data: userData, loading } = useFetch(`/dashboard/admin?month=${selectedFilter}&year=2025&email=${user.email}`);


  console.log(userData)


  const stats = [
  { label: "Total Leads", value: userData?.totalLeads, gradient: "from-cyan-800 to-blue-600" },
  { label: "Total Sales", value: userData?.totalSales, gradient: "from-emerald-800 to-lime-600" },
  { label: "Assigned Leads", value: userData?.assignedLeads, gradient: "from-green-800 to-teal-600" },
  { label: "Unassigned Leads", value: userData?.notAssignedLeads, gradient: "from-yellow-800 to-orange-600" },
  { label: "Admitted", value: userData?.totalEnrolled, gradient: "from-purple-800 to-violet-600" },
  { label: "Joined", value: userData?.joinedOnSeminar, gradient: "from-pink-800 to-rose-600" },
  { label: "Overdue Leads", value: userData?.overdueLeads, gradient: "from-red-900 to-amber-700" },
];



  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-md p-4 text-white shadow-sm bg-gradient-to-r ${item.gradient}`}
        >
          <p className="text-sm font-medium mb-1">{item.label}</p>
          {
            loading ? <p className='animate-pulse py-2'> counting... </p> :  <p className="text-3xl font-bold">
            <CountUp end={item.value || 0} duration={1.5} separator="," />
          </p>
          }
        </div>
      ))}
    </div>
  );
};

export default LeadsStatusPanel;
