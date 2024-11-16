import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.year), // Years as labels
    datasets: [
      {
        label: "Investigations",
        data: data.map((item) => item.investigations), // Investigations count
        backgroundColor: "rgba(54, 162, 235)",
        hoverBackgroundColor: "rgba(54, 162, 235,0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Form 483s Issued by Year",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Set the increment value to 1
        },
      },
    },
  };
  

  return <Bar data={chartData} options={options} />;
}
