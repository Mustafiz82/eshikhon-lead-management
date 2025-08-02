'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const LeadsGrowthChart = () => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Leads',
        data: [100, 140, 160, 200, 250, 270, 320, 360, 400, 420, 450, 500],
        borderColor: '#06b6d4',
        backgroundColor: '#06b6d4',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Admitted Leads',
        data: [10, 20, 35, 50, 60, 65, 80, 90, 100, 110, 115, 120],
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf6',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  return (
    <div className="bg-gray-900 mt-10  rounded-xl shadow-md min-h-[60vh] h-96">
      <h2 className="text-white text-lg font-semibold mb-4">Lead Growth (Last 12 Months)</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LeadsGrowthChart;
