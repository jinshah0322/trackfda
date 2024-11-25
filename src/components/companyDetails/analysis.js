import { useState } from "react";
import InspectionPieChart from "../InspectionPieChart";
import InspectionBarChart from "../inspectionbarchart";
import Limit from "../limit";
import Pagination from "../pagination"; // Import the Pagination component
import Link from "next/link";

export default function AnalysisTab({ data }) {
  const [selectedClassification, setSelectedClassification] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("All");
  const [selectedProjectArea, setSelectedProjectArea] = useState("All");
  const [selectedPostedCitation, setSelectedPostedCitation] = useState("All");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const handleFilterChange = (event) => {
    setSelectedClassification(event.target.value);
    setPage(1);
  };

  const handleProductTypeChange = (event) => {
    setSelectedProductType(event.target.value);
    setPage(1);
  };

  const handleProjectAreaChange = (event) => {
    setSelectedProjectArea(event.target.value);
    setPage(1);
  };

  const handlePostedCitationChange = (event) => {
    setSelectedPostedCitation(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedClassification("All");
    setSelectedProductType("All");
    setSelectedProjectArea("All");
    setSelectedPostedCitation("All");
    setPage(1);
  };

  const filteredData = data.inspectionDetails.filter((item) => {
    const isClassificationMatch =
      selectedClassification === "All" ||
      item.classification === selectedClassification;
    const isProductTypeMatch =
      selectedProductType === "All" ||
      item.product_type === selectedProductType;
    const isProjectAreaMatch =
      selectedProjectArea === "All" ||
      item.project_area === selectedProjectArea;
    const isPostedCitationMatch =
      selectedPostedCitation === "All" ||
      item.posted_citations === selectedPostedCitation;

    return (
      isClassificationMatch &&
      isProductTypeMatch &&
      isProjectAreaMatch &&
      isPostedCitationMatch
    );
  });

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

  // Calculate total pages based on filtered data and limit
  const totalPages = Math.ceil(filteredData.length / limit);

  // Slice the filtered data to apply the limit and page
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);
  return (
    <>
      {/* Cards Section */}
      <div className="cards-container">
        <div className="card">
          <p className="card-title">Total Facilities</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalFacilities}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalInspections}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalPublished483s}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total Warning Letters</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalWarningLetters}
          </p>
        </div>
      </div>
      {/* Pass the data to the Pie Chart component */}
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
      {/* Filter section */}

      <div
        className="filter-container"
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Filter Dropdowns */}
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="classification-filter">Classification: </label>
          <select
            id="classification-filter"
            value={selectedClassification}
            onChange={handleFilterChange}
          >
            <option value="All">All Classifications</option>
            {data.inspectionClassification.map((classification, index) => (
              <option key={index} value={classification.abbrevation}>
                {`${classification.classification} (${classification.abbrevation})`}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="product-type-filter">Product Type: </label>
          <select
            id="product-type-filter"
            value={selectedProductType}
            onChange={handleProductTypeChange}
          >
            <option value="All">All Product Types</option>
            {Array.from(
              new Set(data.inspectionDetails.map((item) => item.product_type))
            ).map((productType, index) => (
              <option key={index} value={productType}>
                {productType}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="project-area-filter">Project Area: </label>
          <select
            id="project-area-filter"
            value={selectedProjectArea}
            onChange={handleProjectAreaChange}
          >
            <option value="All">All Project Areas</option>
            {Array.from(
              new Set(data.inspectionDetails.map((item) => item.project_area))
            ).map((projectArea, index) => (
              <option key={index} value={projectArea}>
                {projectArea}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="posted-citation-filter">Posted Citation: </label>
          <select
            id="posted-citation-filter"
            value={selectedPostedCitation}
            onChange={handlePostedCitationChange}
          >
            <option value="All">All Posted Citations</option>
            {Array.from(
              new Set(
                data.inspectionDetails.map((item) => item.posted_citations)
              )
            ).map((postedCitation, index) => (
              <option key={index} value={postedCitation}>
                {postedCitation}
              </option>
            ))}
          </select>
        </div>
        <button onClick={clearFilters}>Clear All Filters</button>
      </div>

      <Limit onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Inspections available for this company.</h2>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company Address</th>
                <th>FEI Number</th>
                <th>Classification</th>
                <th>Product Type</th>
                <th>Project Area</th>
                <th>Posted Citations</th>
                <th>Fiscal Year</th>
                <th>Inspection End Date</th>
                <th>Inspection Citations</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.firm_address}</td>
                  <td> <Link className="linkDecoration" href={`/company/${item.legal_name}/facility/${item.fei_number}`}>{item.fei_number}</Link>
                  </td>
                  <td>{item.classification}</td>
                  <td>{item.product_type}</td>
                  <td>{item.project_area}</td>
                  <td>{item.posted_citations}</td>
                  <td>{item.fiscal_year}</td>
                  <td>
                    {new Date(item.inspection_end_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td>
                    {item.posted_citations.toLowerCase() === "yes" ? (
                      <Link
                        href={`/company/${data.companyname}/${item.fei_number}`}
                      >
                        <button
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          View Citations
                        </button>
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
