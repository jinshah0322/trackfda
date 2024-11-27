import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";
import Link from "next/link";

export default function Form483sTab({ data = [] }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(""); // No sorting initially
  const [sortOrder, setSortOrder] = useState("asc");

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <h2>No Form 483s available for this company.</h2>
      </div>
    );
  }

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parsedDate = new Date(dateStr);

    if (isNaN(parsedDate)) {
      const [day, month, year] = dateStr.split("-");
      return new Date(`${year}-${month}-${day}`);
    }

    return parsedDate;
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

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a?.[sortField] ?? "";
    const bValue = b?.[sortField] ?? "";

    if (sortField === "record_date") {
      const aDate = parseDate(aValue);
      const bDate = parseDate(bValue);

      if (!aDate || !bDate || isNaN(aDate) || isNaN(bDate)) return 0;

      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    return sortOrder === "asc"
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  const totalPages = Math.ceil(sortedData.length / limit);
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Limit limit={limit} onLimitChange={handleLimitChange} />
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => toggleSort("record_date")}
            >
              Issue Date
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
                    opacity: sortField === "record_date" && sortOrder === "asc" ? 1 : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity: sortField === "record_date" && sortOrder === "desc" ? 1 : 0.5,
                  }}
                >
                  ▼
                </span>
              </span>
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>
              Company Address
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>
              FEI Number
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => toggleSort("inspection_duration")}
            >
              Inspection Duration
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
                    opacity: sortField === "inspection_duration" && sortOrder === "asc" ? 1 : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity: sortField === "inspection_duration" && sortOrder === "desc" ? 1 : 0.5,
                  }}
                >
                  ▼
                </span>
              </span>
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Form 483
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.record_date}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.firm_address}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  className="linkDecoration"
                  href={`/company/${item.legal_name}/facility/${item.fei_number}`}
                >
                  {item.fei_number}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.inspection_duration}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => window.open(item.download_link, "_blank")}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalRecords={sortedData.length}
      />
    </div>
  );
}
