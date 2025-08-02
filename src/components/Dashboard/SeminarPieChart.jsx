// components/charts/SeminarPieChart.jsx
"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// 🟢 Dummy Data for lead count (replace with real counts later)
const seminarOptions = [
  "Digital Marketing",
  "Graphic Design",
  "Career Guideline",
  "Ethical Hacking",
  "Web Development",
];

const leadCounts = {
  "Digital Marketing": 220,
  "Graphic Design": 180,
  "Career Guideline": 120,
  "Ethical Hacking": 95,
  "Web Development": 85,
};

const SeminarPieChart = () => {
  const data = {
    labels: seminarOptions,
    datasets: [
      {
        label: "Leads by Seminar Topic",
        data: seminarOptions.map((topic) => leadCounts[topic] || 0),
        backgroundColor: [
          "#4f46e5", // Digital Marketing
          "#06b6d4", // Graphic Design
          "#10b981", // Career Guideline
          "#f59e0b", // Ethical Hacking
          "#ef4444", // Web Development
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff", // white text for dark theme
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} Leads (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow w-full h-96">
      <h2 className="text-xl font-semibold text-center mb-4 text-white">
        Leads by Seminar Topic
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default SeminarPieChart;
