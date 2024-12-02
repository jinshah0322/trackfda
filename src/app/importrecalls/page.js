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
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/importrecalls`
        );
        const result = await response.json();
        const rawData = result.rows || []; // Access rows from response
        setData(rawData);
        setFilteredData(rawData);
      } catch (error) {
        console.error("Error fetching import recalls:", error);
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

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";

    // Check if the field is a date
    if (sortField === "center_classification_date") {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    // Handle string sorting
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle numeric sorting
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0; // Fallback to no sorting if types are inconsistent
  });

  const filteredDataLocal = sortedData.filter((item) => {
    const isSearchTermMatch =
      !searchTerm ||
      item.recalling_firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firm_address?.toLowerCase().includes(searchTerm.toLowerCase());

    return isSearchTermMatch;
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
        <Link href="/recentdata">← Back to Dashboard</Link>
      </div>
      <h1>Import Recalls</h1>
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
            placeholder="Search by company name or address"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button onClick={clearFilters}>Clear All Filters</button>
      </div>

      {/* Limit Component */}
      <Limit limit={limit} onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {filteredDataLocal.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Import Recalls available.</h2>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {renderSortableHeader("Company Name", "recalling_firm_name")}
                {renderSortableHeader("Firm Address", "firm_address")}
                {renderSortableHeader("FEI Number", "fei_number", false)}
                {renderSortableHeader(
                  "Classification",
                  "product_classification"
                )}
                {renderSortableHeader("Status", "status")}
                {renderSortableHeader(
                  "Distribution Pattern",
                  "distribution_pattern"
                )}
                {renderSortableHeader(
                  "Recall Date",
                  "center_classification_date"
                )}
                {renderSortableHeader(
                  "Reason for Recall",
                  "reason_for_recall",
                  false
                )}
                {renderSortableHeader(
                  "Product Description",
                  "product_description",
                  false
                )}
                {renderSortableHeader(
                  "Event Classification",
                  "event_classification"
                )}
                {renderSortableHeader(
                  "Recall Details",
                  "recall_details",
                  false
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.recalling_firm_name}</td>
                  <td>{item.firm_address}</td>
                  <td>
                    <Link
                      href={`/company/${encodeURIComponent(
                        item.recalling_firm_name
                      )}/facility/${item.fei_number}`}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                      }}
                    >
                      {item.fei_number}
                    </Link>
                  </td>
                  <td>{item.product_classification}</td>
                  <td>{item.status}</td>
                  <td>{item.distribution_pattern}</td>
                  <td>
                    {new Date(
                      item.center_classification_date
                    ).toLocaleDateString("en-GB")}
                  </td>
                  <td>{item.reason_for_recall}</td>
                  <td>{item.product_description}</td>
                  <td>{item.event_classification}</td>
                  <td>
                    <a
                      href={item.recall_details}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "blue",
                        textDecoration: "none",
                      }}
                    >
                      View Details
                    </a>
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
