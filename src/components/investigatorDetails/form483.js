import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";

export default function Form483({ data = [] }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All"); // Default filter is "All"

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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / limit);
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
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
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Issue Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Company Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Inspection Duration</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Form 483</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Converted to Warning Letter</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Warning Letter</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.record_date}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.legal_name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.inspection_duration}</td>
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
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
}
