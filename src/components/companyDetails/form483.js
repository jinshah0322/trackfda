import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";

export default function Form483sTab({ data = [] }) {  // Default to an empty array
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // Handle cases where data is not an array or is empty
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <h2>No Form 483s available for this company.</h2>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / limit);
  const paginatedData = data.slice((page - 1) * limit, page * limit);

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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Issue Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Company Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              FEI Number
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(item.record_date).toLocaleDateString("en-GB")}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.legal_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.fei_number}
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
      />
    </div>
  );
}
