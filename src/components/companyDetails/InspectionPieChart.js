// components/InspectionPieChart.js
"use client";

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const InspectionPieChart = ({ data }) => {
  // Prepare the data for the Pie chart
  const pieData = {
    labels: data.labels, // e.g., ["Class A", "Class B", "Class C"]
    datasets: [
      {
        label: 'Classification Distribution',
        data: data.values, // e.g., [10, 20, 30] for counts or percentages
        backgroundColor: [
          '#FF6384', // Class A color
          '#36A2EB', // Class B color
          '#FFCE56'  // Class C color
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }
    ]
  };

  return (
    <div style={{ width: "300px", height: "300px" ,marginBottom:"80px"}}> 
      <h3 style={{ textAlign: 'center' }}>Inspection Classification</h3>
      <Pie data={pieData} />
    </div>
  );
};

export default InspectionPieChart;
