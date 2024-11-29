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
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/importrefusals`
        );
        const result = await response.json();
        const rawData = result.rows || []; // Access rows from response
        setData(rawData);
        setFilteredData(rawData);
      } catch (error) {
        console.error("Error fetching import refusals:", error);
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

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedDivision("All");
    setSearchTerm("");
    setPage(1);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === "refused_date") {
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
    const isDivisionMatch =
      selectedDivision === "All" || item.import_division === selectedDivision;
    const isSearchTermMatch =
      !searchTerm ||
      item.firm_legal_name.toLowerCase().includes(searchTerm.toLowerCase());

    return isDivisionMatch && isSearchTermMatch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredDataLocal.length / limit);

  // Paginate data
  const paginatedData = filteredDataLocal.slice(
    (page - 1) * limit,
    page * limit
  );

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
      <th
        style={{
          padding: "8px",
          width: "150px",
          textAlign: "left",
          userSelect: "none",
        }}
      >
        {label}
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
      <h1>Import Refusals</h1>
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
          <label htmlFor="division-filter">Import Division: </label>
          <select
            id="division-filter"
            value={selectedDivision}
            onChange={handleDivisionChange}
          >
            <option value="All">All Divisions</option>
            {Array.from(new Set(data.map((item) => item.import_division))).map(
              (division, index) => (
                <option key={index} value={division}>
                  {division}
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
          <h2>No Import Refusals available.</h2>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                {renderSortableHeader("Company Name", "firm_legal_name")}
                {renderSortableHeader("Firm Address", "firm_address")}
                {renderSortableHeader("FEI Number", "fei_number", false)}
                {renderSortableHeader(
                  "Product Code",
                  "product_code_description",
                  false
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
                  <td>{item.firm_legal_name}</td>
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
                  <td>{new Date(item.refused_date).toLocaleDateString('en-GB')}</td>
                  <td>{item.import_division}</td>
                  <td>{item.fda_sample_analysis}</td>
                  <td>{item.private_lab_analysis}</td>
                  <td>{item.refusal_charges}</td>
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
