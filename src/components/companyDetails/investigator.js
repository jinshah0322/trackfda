import React, { useState } from "react";
import Pagination from "../pagination";
import Limit from "../limit";
import Link from "next/link";

export default function Investigator({ investigators }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order
  const [searchTerm, setSearchTerm] = useState(""); // Search term

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page when searching
  };

  // Filter investigators based on the search term
  const filteredInvestigators = investigators.filter((item) =>
    item.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredInvestigators].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";

    // Handle string sorting
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0; // Fallback to no sorting if types are inconsistent
  });

  // Paginate data
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(sortedData.length / limit);

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
      {/* Search */}
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
            placeholder="Search investigators"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: "5px", width: "300px" }}
          />
        </div>
      </div>

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
              width: "50%",
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
                  <td style={{ width: "70%" }}>{item.employee_name}</td>
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
  );
}