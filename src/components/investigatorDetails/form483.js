import { useState,useEffect } from "react";
import Limit from "../limit";
import Pagination from "../pagination";

export default function Form483({ data = [] }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All"); // Default filter is "All"
  const [sortField, setSortField] = useState(""); // No sorting initially
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order

  // Synchronize filter with sorting
  useEffect(() => {
    if (sortField === "converted") {
      if (sortOrder === "asc") {
        setFilter("Not Converted");
      } else {
        setFilter("Converted");
      }
    }
  }, [sortField, sortOrder]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <h2>No Form 483s available for this company.</h2>
      </div>
    );
  }

  // Filter logic
  const filteredData = data.filter((item) => {
    if (filter === "All") return true; // Show all records
    if (filter === "Converted") return item.warningletterurl !== ""; // Only converted records
    if (filter === "Not Converted") return item.warningletterurl === ""; // Only not converted records
    return true; // Fallback
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a?.[sortField] ?? "";
    const bValue = b?.[sortField] ?? "";

    // Numeric sorting
    if (["inspection_duration"].includes(sortField)) {
      const aNum = parseFloat(aValue) || 0;
      const bNum = parseFloat(bValue) || 0;
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    }

    // Date sorting
    if (["record_date"].includes(sortField)) {
      const parseDate = (dateStr) => {
        if (!dateStr) return null; // Handle empty dates
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`); // Convert DD-MM-YYYY to YYYY-MM-DD
      };

      const aDate = parseDate(aValue);
      const bDate = parseDate(bValue);

      if (!aDate || !bDate || isNaN(aDate) || isNaN(bDate)) {
        return 0; // Fallback for invalid dates
      }

      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    // Boolean sorting for "Converted to Warning Letter"
    if (sortField === "converted") {
      const aConverted = a.warningletterurl !== "" ? 1 : 0;
      const bConverted = b.warningletterurl !== "" ? 1 : 0;
      return sortOrder === "asc" ? aConverted - bConverted : bConverted - aConverted;
    }

    // String sorting (case-insensitive)
    const aStr = aValue.toString().toLowerCase();
    const bStr = bValue.toString().toLowerCase();
    return sortOrder === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / limit);
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    setPage(1);

    // Adjust sorting when filter changes
    if (newFilter === "Converted" || newFilter === "Not Converted") {
      setSortField("converted");
      setSortOrder(newFilter === "Converted" ? "desc" : "asc");
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };


  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <select
          value={filter}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <option value="All">All</option>
          <option value="Converted">Converted To Warning Letter</option>
          <option value="Not Converted">Not Converted</option>
        </select>
      </div>
      <Limit limit={limit} onLimitChange={handleLimitChange} />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                cursor: "pointer",
                position: "relative",
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
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => toggleSort("legal_name")}
            >
              Company Name
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
                    opacity: sortField === "legal_name" && sortOrder === "asc" ? 1 : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity: sortField === "legal_name" && sortOrder === "desc" ? 1 : 0.5,
                  }}
                >
                  ▼
                </span>
              </span>
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                cursor: "pointer",
                position: "relative",
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
              Inspector&apos;s Role
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Recipient
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Form 483
            </th>
            <th
  style={{
    border: "1px solid #ddd",
    padding: "8px",
    cursor: "pointer",
    position: "relative",
  }}
  onClick={() => toggleSort("converted")}
>
  Converted to Warning Letter
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
        opacity: sortField === "converted" && sortOrder === "asc" ? 1 : 0.5,
      }}
    >
      ▲
    </span>
    <span
      style={{
        opacity: sortField === "converted" && sortOrder === "desc" ? 1 : 0.5,
      }}
    >
      ▼
    </span>
  </span>
</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Warning Letter
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.record_date}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.legal_name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.inspection_duration}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.employee_role}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.report_recipient_name},{" "}
                  {item.report_recipient_title}
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
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.warningletterurl === "" ? "---" : "✓"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.warningletterurl === "" ? (
                    "---"
                  ) : (
                    <button
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(item.warningletterurl, "_blank")
                      }
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
