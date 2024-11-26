import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";
import Link from "next/link";

export default function WarningLettersTab({ data }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(""); // No sorting initially
  const [sortOrder, setSortOrder] = useState("asc");

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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

  const sortedData = data.sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    if (sortOrder === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const totalPages = Math.ceil(sortedData.length / limit);
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  return (
    <div>
      {paginatedData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Warning letter available for this company.</h2>
        </div>
      ) : (
        <>
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
                    cursor: "pointer", // Makes the header interactive
                  }}
                  onClick={() => toggleSort("letterissuedate")}
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
                        opacity: sortField === "letterissuedate" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "letterissuedate" && sortOrder === "desc" ? 1 : 0.5,
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
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("firm_address")}
                >
                  Company Address
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
                        opacity: sortField === "firm_address" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "firm_address" && sortOrder === "desc" ? 1 : 0.5,
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
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("fei_number")}
                >
                  FEI Number
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
                        opacity: sortField === "fei_number" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "fei_number" && sortOrder === "desc" ? 1 : 0.5,
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
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("issuingoffice")}
                >
                  Issuing Office
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
                        opacity: sortField === "issuingoffice" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "issuingoffice" && sortOrder === "desc" ? 1 : 0.5,
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
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("subject")}
                >
                  Subject
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
                        opacity: sortField === "subject" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "subject" && sortOrder === "desc" ? 1 : 0.5,
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>view</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.letterissuedate}
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
                    {item.issuingoffice}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.subject}
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
                      onClick={() =>
                        window.open(item.warningletterurl, "_blank")
                      }
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
        </>
      )}
    </div>
  );
}
