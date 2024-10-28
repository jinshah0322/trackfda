import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InspectionBarChart = ({ chartData }) => {
    console.log(chartData)
  return (
    <div className="container">
      <h3 style={{ textAlign: 'center' }}>Inspection done by year</h3>
      <Bar  style={{
        width:"700px",
        margin:'2rem'
    }} options={{
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
          }
        },
      }} data={chartData} />
    </div>
  );
};

export default InspectionBarChart;
