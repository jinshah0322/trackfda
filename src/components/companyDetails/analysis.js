import { useState } from "react";
import InspectionPieChart from "../InspectionPieChart";
import InspectionBarChart from "../inspectionbarchart";
import Limit from "../limit";
import Pagination from "../pagination"; // Import the Pagination component
import Link from "next/link";

export default function AnalysisTab({
  data,
  setActiveTab,
  handleScrollToInspections,
  inspectionRef,
}) {
  const [selectedClassification, setSelectedClassification] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("All");
  const [selectedProjectArea, setSelectedProjectArea] = useState("All");
  const [selectedPostedCitation, setSelectedPostedCitation] = useState("All");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(""); // No sorting initially
  const [sortOrder, setSortOrder] = useState("asc");

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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const filteredData = data.inspectionDetails
    .filter((item) => {
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
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      if (sortOrder === "asc") {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

  // Compute pie chart data
  const inspectionClassificationCounts = data.inspectionDetails.reduce(
    (acc, item) => {
      const key = item.classification || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const pieChartData = {
    labels: Object.keys(inspectionClassificationCounts),
    values: Object.values(inspectionClassificationCounts),
  };

  // Compute bar chart data
  const uniqueYears = [
    ...new Set(
      data.inspectionDetails.map((item) => item.fiscal_year.toString())
    ),
  ].sort();

  const barChartData = {
    labels: uniqueYears,
    datasets: [
      {
        label: "OAI",
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
        label: "NAI",
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
        {/* Cards for statistics */}
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

      {/* Filter Section */}
      <div className="filter-container">
        <button onClick={clearFilters}>Clear All Filters</button>
      </div>

      <Limit onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }} ref={inspectionRef}>
          <h2>No Inspections available for this company.</h2>
        </div>
      ) : (
        <>
          <table
            className="data-table"
            ref={inspectionRef}
            style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "150px",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                  onClick={() => toggleSort("firm_address")}
                >
                  Company Address
                  <span
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                    }}
                  >
                    <span
                      style={{
                        opacity: sortField === "firm_address" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "firm_address" && sortOrder === "desc" ? 1 : 0.5,
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </th>
                <th
                  style={{
                    width: "150px",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                  onClick={() => toggleSort("fei_number")}
                >
                  FEI Number
                  <span
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                    }}
                  >
                    <span
                      style={{
                        opacity: sortField === "fei_number" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "fei_number" && sortOrder === "desc" ? 1 : 0.5,
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </th>
                <th
                  style={{
                    width: "150px",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                  onClick={() => toggleSort("classification")}
                >
                  Classification
                  <span
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                    }}
                  >
                    <span
                      style={{
                        opacity: sortField === "classification" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "classification" && sortOrder === "desc" ? 1 : 0.5,
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </th>
                {/* Add similar headers for other fields */}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {item.firm_address}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    <Link
                      href={`/company/${item.legal_name}/facility/${item.fei_number}`}
                    >
                      {item.fei_number}
                    </Link>
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {item.classification}
                  </td>
                  {/* Additional rows */}
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
