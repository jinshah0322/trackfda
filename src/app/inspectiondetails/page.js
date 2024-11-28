"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/pagination";
import Limit from "@/components/limit";
import Loading from "@/components/loading";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]); // Full fetched data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [selectedClassification, setSelectedClassification] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("All");
  const [selectedProjectArea, setSelectedProjectArea] = useState("All");
  const [selectedPostedCitation, setSelectedPostedCitation] = useState("All");
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/inspectiondetails`
        );
        const result = await response.json();
        const rawData = result.inspectiondetails || [];
        setData(rawData);
        setFilteredData(rawData);
      } catch (error) {
        console.error("Error fetching inspection details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

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
    setSearchTerm("");
    setPage(1);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === "inspection_end_date") {
      const aDate = new Date(a[sortField]);
      const bDate = new Date(b[sortField]);
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    const aValue = a[sortField]?.toString().toLowerCase() || "";
    const bValue = b[sortField]?.toString().toLowerCase() || "";

    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const filteredDataLocal = sortedData.filter((item) => {
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
    const isSearchTermMatch =
      !searchTerm ||
      item.legal_name.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      isClassificationMatch &&
      isProductTypeMatch &&
      isProjectAreaMatch &&
      isPostedCitationMatch &&
      isSearchTermMatch
    );
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredDataLocal.length / limit);

  // Paginate data
  const paginatedData = filteredDataLocal.slice(
    (page - 1) * limit,
    page * limit
  );

  const renderSortableHeader = (label, field) => (
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
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Inspection Details</h1>
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
          <label htmlFor="search-filter">Search: </label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search by company name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="classification-filter">Classification: </label>
          <select
            id="classification-filter"
            value={selectedClassification}
            onChange={handleFilterChange}
          >
            <option value="All">All Classifications</option>
            {Array.from(new Set(data.map((item) => item.classification))).map(
              (classification, index) => (
                <option key={index} value={classification}>
                  {classification}
                </option>
              )
            )}
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
            {Array.from(new Set(data.map((item) => item.product_type))).map(
              (productType, index) => (
                <option key={index} value={productType}>
                  {productType}
                </option>
              )
            )}
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
            {Array.from(new Set(data.map((item) => item.project_area))).map(
              (projectArea, index) => (
                <option key={index} value={projectArea}>
                  {projectArea}
                </option>
              )
            )}
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
            {Array.from(new Set(data.map((item) => item.posted_citations))).map(
              (postedCitation, index) => (
                <option key={index} value={postedCitation}>
                  {postedCitation}
                </option>
              )
            )}
          </select>
        </div>
        <button onClick={clearFilters}>Clear All Filters</button>
      </div>

      {/* Limit Component */}
      <Limit limit={limit} onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {filteredDataLocal.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Inspections available.</h2>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                {renderSortableHeader("Company Name", "legal_name")}
                {renderSortableHeader("Company Address", "firm_address")}
                <th>FEI Number</th>
                <th>Classification</th>
                <th>Product Type</th>
                <th>Project Area</th>
                {renderSortableHeader("Fiscal Year", "fiscal_year")}
                {renderSortableHeader(
                  "Inspection End Date",
                  "inspection_end_date"
                )}
                <th>Inspection Citations</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.legal_name}</td>
                  <td>{item.firm_address}</td>
                  <td>
                    <Link
                      href={`/company/${encodeURIComponent(
                        item.legal_name
                      )}/facility/${item.fei_number}`}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                      }}
                    >
                      {item.fei_number}
                    </Link>
                  </td>
                  <td>{item.classification}</td>
                  <td>{item.product_type}</td>
                  <td>{item.project_area}</td>
                  <td>{item.fiscal_year}</td>
                  <td>
                    {new Date(item.inspection_end_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td>
                    {item.posted_citations.toLowerCase() === "yes" ? (
                      <Link
                        href={`/company/${encodeURIComponent(
                          item.legal_name
                        )}/${item.inspection_id}`}
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
                          View
                        </button>
                      </Link>
                    ) : (
                      "---"
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
            totalRecords={filteredDataLocal.length}
          />
        </>
      )}
    </>
  );
}
