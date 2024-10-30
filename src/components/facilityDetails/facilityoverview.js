import Map from "../map";
import InspectionPieChart from "@/components/InspectionPieChart";
import InspectionBarChart from "@/components/inspectionbarchart";

export default function FacilityOverview({data}) {
  function countOccurrences(array, key) {
    return array.reduce((acc, item) => {
      const feiNumber = item[key] || Unkown;
      acc[feiNumber] = (acc[feiNumber] || 0) + 1;
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

  return (
    <div>
      <h2>Facility Details</h2>
      <p>
        <strong>Name:</strong> {data.facilityDetails.legal_name}
      </p>
      <p>
        <strong>FEI Number:</strong>{" "}
        {data.facilityDetails.fei_number}
      </p>
      <p>
        <strong>Firm Profile:</strong>{" "}
        <a
          href={data.facilityDetails.firm_profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.facilityDetails.firm_profile}
        </a>
      </p>
      <p>
        <strong>Location:</strong>{" "}
        {data.facilityDetails.firm_address}
      </p>
      <Map location={data.facilityDetails.firm_address}/>
      <InspectionPieChart data={pieChartData} />
      <InspectionBarChart chartData={barChartData} />
    </div>
  );
}
