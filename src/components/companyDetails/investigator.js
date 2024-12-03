import React, { useState } from "react";
import Pagination from "../pagination";
import Limit from "../limit";
import Link from "next/link";

export default function Investigator({ investigators }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  const totalPages = Math.ceil(investigators.length / limit);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...investigators].sort((a, b) => {
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
    return(
        <div>
      {/* Limit Component */}
      <Limit limit={limit} onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {sortedData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Investigators available.</h2>
        </div>
      ) : (
        <>
          <table
            style={{
              width: "30%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                {renderSortableHeader("Investigators", "employee_name")}
                {renderSortableHeader("FEI Number", "fei_number", false)}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td style={{width:"70%"}}>{item.employee_name}</td>
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Component */}
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            totalRecords={sortedData.length}
          />
        </>
      )}
    </div>
    )
}