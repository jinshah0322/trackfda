import React, { useState } from "react";
import Pagination from "../pagination";
import Limit from "../limit";
import Link from "next/link";

export default function ImportRecall({ importrecalls }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order
  const [selectedStatus, setSelectedStatus] = useState("All"); // Filter for status

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setPage(1); // Reset to the first page when filtering
  };

  // Filter data based on selected status
  const filteredData = importrecalls.filter((item) => {
    return selectedStatus === "All" || item.status === selectedStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";

    // Handle date sorting
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

  // Paginate data
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredData.length / limit);

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
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ marginRight: "15px" }}>
          <label htmlFor="status-filter">Status: </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ padding: "5px", width: "200px" }}
          >
            <option value="All">All Status</option>
            {[...new Set(importrecalls.map((item) => item.status))].map(
              (status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Limit Component */}
      <Limit limit={limit} onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Import Recalls available.</h2>
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
                <th>FEI Number</th>
                <th>Status</th>
                <th>Distribution Pattern</th>
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
                  "Product Classification",
                  "product_classification"
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
                  <td>{item.status}</td>
                  <td>{item.distribution_pattern}</td>
                  <td>
                    {new Date(item.center_classification_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td>{item.reason_for_recall}</td>
                  <td>{item.product_description}</td>
                  <td>{item.product_classification}</td>
                  <td>{item.event_classification}</td>
                  <td>
                    <a
                      href={item.recall_details}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "blue",
                      }}
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Component */}
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            totalRecords={filteredData.length}
          />
        </>
      )}
    </div>
  );
}
