import React, { useState } from "react";
import Pagination from "../pagination";
import Limit from "../limit";
import Link from "next/link";

export default function ImportRefusal({ importrefusals = [] }) {
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [selectedDivision, setSelectedDivision] = useState("All"); // Import Division filter
  const [selectedFDAAnalysis, setSelectedFDAAnalysis] = useState("All"); // FDA Analysis filter
  const [selectedPrivateLabAnalysis, setSelectedPrivateLabAnalysis] =
    useState("All"); // Private Lab Analysis filter
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page when limit changes
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    setPage(1);
  };

  const handleFDAAnalysisChange = (e) => {
    setSelectedFDAAnalysis(e.target.value);
    setPage(1);
  };

  const handlePrivateLabAnalysisChange = (e) => {
    setSelectedPrivateLabAnalysis(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedDivision("All");
    setSelectedFDAAnalysis("All");
    setSelectedPrivateLabAnalysis("All");
    setPage(1);
  };

  // Filtering data based on dropdown filters
  const filteredData = importrefusals.filter((item) => {
    const isDivisionMatch =
      selectedDivision === "All" || item.import_division === selectedDivision;

    const isFDAAnalysisMatch =
      selectedFDAAnalysis === "All" ||
      (selectedFDAAnalysis === "Yes" && item.fda_sample_analysis === "Yes") ||
      (selectedFDAAnalysis === "No" && item.fda_sample_analysis === "No");

    const isPrivateLabAnalysisMatch =
      selectedPrivateLabAnalysis === "All" ||
      (selectedPrivateLabAnalysis === "Yes" &&
        item.private_lab_analysis === "Yes") ||
      (selectedPrivateLabAnalysis === "No" &&
        item.private_lab_analysis === "No");

    return isDivisionMatch && isFDAAnalysisMatch && isPrivateLabAnalysisMatch;
  });

  // Sorting data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";

    if (sortField === "refused_date") {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Paginating data
  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  const renderSortableHeader = (label, field, isSortable = true) =>
    isSortable ? (
      <th
        onClick={() => handleSort(field)}
        style={{
          padding: "8px",
          width: "150px",
          textAlign: "left",
          position: "relative",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {label}
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
              opacity: sortField === field && sortOrder === "asc" ? 1 : 0.5,
            }}
          >
            ▲
          </span>
          <span
            style={{
              opacity: sortField === field && sortOrder === "desc" ? 1 : 0.5,
            }}
          >
            ▼
          </span>
        </span>
      </th>
    ) : (
      <th>{label}</th>
    );

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="division-filter">Import Division: </label>
          <select
            id="division-filter"
            value={selectedDivision}
            onChange={handleDivisionChange}
          >
            <option value="All">All</option>
            {Array.from(
              new Set(importrefusals.map((item) => item.import_division))
            ).map((division, index) => (
              <option key={index} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="fda-analysis-filter">FDA Analysis: </label>
          <select
            id="fda-analysis-filter"
            value={selectedFDAAnalysis}
            onChange={handleFDAAnalysisChange}
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="private-lab-analysis-filter">
            Private Lab Analysis:{" "}
          </label>
          <select
            id="private-lab-analysis-filter"
            value={selectedPrivateLabAnalysis}
            onChange={handlePrivateLabAnalysisChange}
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <button onClick={clearFilters}>Clear All Filters</button>
      </div>

      {/* Limit Component */}
      <Limit limit={limit} onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {totalRecords === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Import Refusals available.</h2>
        </div>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                {renderSortableHeader("Firm Address", "firm_address")}
                {renderSortableHeader("FEI Number", "fei_number")}
                {renderSortableHeader(
                  "Product Code",
                  "product_code_description"
                )}
                {renderSortableHeader("Refused Date", "refused_date")}
                {renderSortableHeader("Import Division", "import_division")}
                {renderSortableHeader("FDA Analysis", "fda_sample_analysis")}
                {renderSortableHeader(
                  "Private Lab Analysis",
                  "private_lab_analysis"
                )}
                {renderSortableHeader("Refusal Charges", "refusal_charges")}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.firm_address}</td>
                  <td>
                    <Link
                      href={`/company/${encodeURIComponent(
                        item.firm_legal_name
                      )}/facility/${item.fei_number}`}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                      }}
                    >
                      {item.fei_number}
                    </Link>
                  </td>
                  <td>{item.product_code_description}</td>
                  <td>
                    {new Date(item.refused_date).toLocaleDateString("en-GB")}
                  </td>
                  <td>{item.import_division}</td>
                  <td>{item.fda_sample_analysis}</td>
                  <td>{item.private_lab_analysis}</td>
                  <td>{item.refusal_charges}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            totalRecords={totalRecords}
          />
        </>
      )}
    </div>
  );
}
