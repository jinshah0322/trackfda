import InspectionPieChart from "../InspectionPieChart";
import InspectionBarChart from "../inspectionbarchart";

export default function AnalysisTab({
  data,
  setActiveTab,
}) {
  function countOccurrences(array, key) {
    return array.reduce((acc, item) => {
      const value = item[key] || "Unknown";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  const InspectionClassificationCount = countOccurrences(
    data.inspectionDetails,
    "classification"
  );

  const inspectionData = Object.entries(InspectionClassificationCount).map(
    ([classification, count]) => ({
      classification,
      count,
    })
  );

  const pieChartData = {
    labels: inspectionData.map((item) => item.classification), // ["Class A", "Class B", "Class C"]
    values: inspectionData.map((item) => item.count), // [10, 20, 30]
  };

  const uniqueYears = [
    ...new Set(
      data.inspectionDetails.map((item) => item.fiscal_year.toString())
    ),
  ].sort();

  const barChartData = {
    labels: uniqueYears,
    datasets: [
      {
        label: "ΟΑΙ",
        data: Array(uniqueYears.length).fill(0),
        backgroundColor: "orange",
        stack: "Stack 0",
      },
      {
        label: "VAI",
        data: Array(uniqueYears.length).fill(0),
        backgroundColor: "dodgerblue",
        stack: "Stack 0",
      },
      {
        label: "ΝΑΙ",
        data: Array(uniqueYears.length).fill(0),
        backgroundColor: "skyblue",
        stack: "Stack 0",
      },
    ],
  };

  data.inspectionDetails.forEach((item) => {
    const yearIndex = barChartData.labels.indexOf(item.fiscal_year.toString());

    if (yearIndex !== -1) {
      if (item.classification === "OAI") {
        barChartData.datasets[0].data[yearIndex] += 1;
      } else if (item.classification === "VAI") {
        barChartData.datasets[1].data[yearIndex] += 1;
      } else if (item.classification === "NAI") {
        barChartData.datasets[2].data[yearIndex] += 1;
      }
    } else {
      console.warn(
        `Fiscal year ${item.fiscal_year} not found in barChartData.labels`
      );
    }
  });

  return (
    <>
      {/* Cards Section */}
      <div className="cards-container">
        <div
          className="card"
          onClick={() => setActiveTab("facilities")}
          style={{ cursor: "pointer" }}
        >
          <p className="card-title">Total Facilities</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalFacilities}
          </p>
        </div>
        <div
          className="card"
          style={{ cursor: "pointer" }}
          onClick={() => setActiveTab("inspectiondetails")}
        >
          <p className="card-title">Total Inspections</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalInspections}
          </p>
        </div>
        <div
          className="card"
          onClick={() => setActiveTab("form483s")}
          style={{ cursor: "pointer" }}
        >
          <p className="card-title">Total Published 483</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalPublished483s}
          </p>
        </div>
        <div
          className="card"
          onClick={() => setActiveTab("warningletters")}
          style={{ cursor: "pointer" }}
        >
          <p className="card-title">Total Warning Letters</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalWarningLetters}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "space-between",
          flexWrap: "wrap",
        }}
      >
        <InspectionPieChart data={pieChartData} />
        <InspectionBarChart chartData={barChartData} />
      </div>
    </>
  );
}
