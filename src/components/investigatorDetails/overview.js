import BarChart from "../countByYearBarChart";
import Link from "next/link";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";
import { useState, useEffect } from "react";

export default function Overview({
  data,
  setActiveTab,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const [totalCount, setTotalCount] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [sortField, setSortField] = useState(""); // No sorting initially
  const [sortOrder, setSortOrder] = useState("asc");

  const { last_record_date, num_483s_issued, overview } = data;

  useEffect(() => {
    const overviewData = overview.facilityDetails_issueDate || [];

    // Sorting logic
    const sortedData = [...overviewData].sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a?.[sortField] ?? "";
      const bValue = b?.[sortField] ?? "";

      // Sorting by date
      if (sortField === "record_dates") {
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return new Date(`${year}-${month}-${day}`);
        };

        const aDate = parseDate(aValue);
        const bDate = parseDate(bValue);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      // Sorting by string (e.g., `legal_name`)
      const aStr = aValue.toString().toLowerCase();
      const bStr = bValue.toString().toLowerCase();
      return sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    // Pagination logic
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = sortedData.slice(start, end);

    setFilteredData(paginatedData);
    setTotalCount(overviewData.length);
  }, [overview, page, limit, sortField, sortOrder]);

  const totalPages = Math.ceil(totalCount / limit);

  // Toggle sorting order and field
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
        className="cards-container"
        style={{ gap: "10px", justifyContent: "flex-start" }}
      >
        <div className="card">
          <p className="card-title">Last Form 483 Issued Date</p>
          <p className="card-number">{last_record_date}</p>
        </div>
        <div
          className="card"
          onClick={() => setActiveTab("form483s")}
          style={{ cursor: "pointer" }}
        >
          <p className="card-title">Form 483s Issued</p>
          <p className="card-number">{num_483s_issued}</p>
        </div>
      </div>

      <div
        className="chart-container"
        style={{
          marginTop: "20px",
          width: "100%",
          maxWidth: "800px",
          height: "400px",
        }}
      >
        {overview && overview.investigationByYear ? (
          <BarChart data={overview.investigationByYear} />
        ) : (
          <h1>No data available for investigations by year.</h1>
        )}
      </div>

      <Limit limit={limit} onLimitChange={onLimitChange} />

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
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
              onClick={() => toggleSort("legal_name")}
            >
              Facility Name
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
                      sortField === "legal_name" && sortOrder === "asc"
                        ? 1
                        : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity:
                      sortField === "legal_name" && sortOrder === "desc"
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
              }}
            >
              Facility Location
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => toggleSort("record_dates")}
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
                    opacity:
                      sortField === "record_dates" && sortOrder === "asc"
                        ? 1
                        : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity:
                      sortField === "record_dates" && sortOrder === "desc"
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
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  style={{ color: "blue", textDecoration: "none" }}
                  href={`/company/${item.legal_name}/facility/${item.fei_number}`}
                >
                  {item.legal_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.firm_address}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.record_dates}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
