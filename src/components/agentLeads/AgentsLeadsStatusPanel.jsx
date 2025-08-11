
import CountUp from 'react-countup';

const stats = [
  { label: "Total Leads", value: 120, gradient: "from-cyan-800 to-blue-600" },
  { label: "Total Sales", value: 150, gradient: "from-emerald-800 to-lime-600" }, 
  { label: "Admitted", value: 120, gradient: "from-purple-800 to-violet-600" },
  { label: "Joined", value: 80, gradient: "from-pink-800 to-rose-600" },
  { label: "This Month Leads", value: 220, gradient: "from-indigo-800 to-blue-700" },
  { label: "This Month Sales", value: 220, gradient: "from-indigo-800 to-blue-700" },
  { label: "Overdue Leads", value: 34, gradient: "from-red-900 to-amber-700" },
];


const AgentsLeadsStatusPanel = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-md p-4 text-white shadow-sm bg-gradient-to-r ${item.gradient}`}
        >
          <p className="text-sm font-medium mb-1">{item.label}</p>
          <p className="text-3xl font-bold">
            <CountUp end={item.value || 0} duration={1.5} separator="," />
          </p>
        </div>
      ))}
    </div>
  );
};

export default AgentsLeadsStatusPanel;
