import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";
import Link from "next/link";
import "@/app/style.css";

export default function FacilitiesTab({ data }) {
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

    const aValue = a[sortField] ?? ""; // Default to empty string for null/undefined
    const bValue = b[sortField] ?? ""; // Default to empty string for null/undefined

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sortOrder === "asc"
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  const totalPages = Math.ceil(sortedData.length / limit);
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  return (
    <div>
      {paginatedData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No facilities available for this company.</h2>
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
                  }}
                >
                  Fei Number
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSort("city")}
                >
                  City
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
                        opacity: sortField === "city" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "city" && sortOrder === "desc" ? 1 : 0.5,
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
                  onClick={() => toggleSort("state")}
                >
                  State
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
                        opacity: sortField === "state" && sortOrder === "asc" ? 1 : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity: sortField === "state" && sortOrder === "desc" ? 1 : 0.5,
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
                  onClick={() => toggleSort("country_area")}
                >
                  Country
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
                        opacity:
                          sortField === "country_area" && sortOrder === "asc"
                            ? 1
                            : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity:
                          sortField === "country_area" && sortOrder === "desc"
                            ? 1
                            : 0.5,
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
                  onClick={() => toggleSort("form483_count")}
                >
                  Number Of 483s
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
                        opacity:
                          sortField === "form483_count" && sortOrder === "asc"
                            ? 1
                            : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity:
                          sortField === "form483_count" && sortOrder === "desc"
                            ? 1
                            : 0.5,
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
                  onClick={() => toggleSort("warning_letter_count")}
                >
                  Number Of Warning Letters
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
                        opacity:
                          sortField === "warning_letter_count" &&
                          sortOrder === "asc"
                            ? 1
                            : 0.5,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        opacity:
                          sortField === "warning_letter_count" &&
                          sortOrder === "desc"
                            ? 1
                            : 0.5,
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Link
                      className="linkDecoration"
                      href={`/company/${item.legal_name}/facility/${item.fei_number}`}
                    >
                      {item.fei_number}
                    </Link>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.city || "N/A"} {/* Default value for null */}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.state || "N/A"} {/* Default value for null */}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.country_area || "N/A"} {/* Default value for null */}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.form483_count}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.warning_letter_count}
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
