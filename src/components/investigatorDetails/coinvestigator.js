import { useState } from "react";
import Link from "next/link";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";

export default function Coinvestigator({
  data,
  onTabChange,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a?.[sortField] ?? "";
    const bValue = b?.[sortField] ?? "";

    if (sortField === "investigations_done") {
      const aNum = parseInt(aValue, 10) || 0;
      const bNum = parseInt(bValue, 10) || 0;
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = aValue.toString().toLowerCase();
    const bStr = bValue.toString().toLowerCase();
    return sortOrder === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const paginatedData = sortedData.slice(startIndex, endIndex);

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
      <Limit limit={limit} onLimitChange={onLimitChange} />
      <table
        style={{
          width: "35%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{ border: "1px solid #ddd", padding: "8px", cursor: "pointer", position: "relative" }}
              onClick={() => toggleSort("co_employee_name")}
            >
              Co-Investigator Name
              <span
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "white",
                }}
              >
                <span
                  style={{
                    opacity: sortField === "co_employee_name" && sortOrder === "asc" ? 1 : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity: sortField === "co_employee_name" && sortOrder === "desc" ? 1 : 0.5,
                  }}
                >
                  ▼
                </span>
              </span>
            </th>
            <th
              style={{ border: "1px solid #ddd", padding: "8px", cursor: "pointer", position: "relative" }}
              onClick={() => toggleSort("investigations_done")}
            >
              Number of Investigations Done
              <span
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "white",
                }}
              >
                <span
                  style={{
                    opacity: sortField === "investigations_done" && sortOrder === "asc" ? 1 : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity: sortField === "investigations_done" && sortOrder === "desc" ? 1 : 0.5,
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
                  style={{ color: "blue", textDecoration: "none" }}
                  href={`/investigators/investigator_details?name=${item.co_employee_name}`}
                  onClick={() => onTabChange("overview")}
                >
                  {item.co_employee_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.investigations_done}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={Math.ceil(data.length / limit)}
        onPageChange={onPageChange}
        totalRecords={sortedData.length}
      />
    </>
  );
}