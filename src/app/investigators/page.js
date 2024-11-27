"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Search from "@/components/search";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(""); // No sorting initially
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/investigators?search=${encodeURIComponent(searchTerm)}`
        );
        response = await response.json();
        setData(response.employeesData);
      } catch (error) {
        console.error("Error fetching employees data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    const sortedData = [...data].sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a?.[sortField] ?? "";
      const bValue = b?.[sortField] ?? "";

      if (
        sortField === "num_483s_issued" ||
        sortField === "warning_letter_count"
      ) {
        const aNum = parseFloat(bValue) || 0;
        const bNum = parseFloat(aValue) || 0;
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }
      if (sortField === "conversion_rate") {
        // Conversion rate sorting (percentage)
        const aConversion = a.warning_letter_count / a.num_483s_issued || 0;
        const bConversion = b.warning_letter_count / b.num_483s_issued || 0;
        return sortOrder === "asc"
          ? bConversion - aConversion
          : aConversion - bConversion;
      }

      if (
        sortField === "latest_record_date" ||
        sortField === "latest_warning_letter_date"
      ) {
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return new Date(`${year}-${month}-${day}`);
        };

        const aDate = parseDate(bValue);
        const bDate = parseDate(aValue);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      const aStr = aValue.toLowerCase();
      const bStr = bValue.toLowerCase();
      return sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    // Paginate data
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = sortedData.slice(start, end);

    setFilteredData(paginatedData);
    setTotalCount(data.length);
  }, [data, page, limit, sortField, sortOrder]);
  const totalPages = Math.ceil(totalCount / limit);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Investigator List</h1>

      <Search
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setPage(1); // Reset to page 1 on new search
        }}
        placeholder="Search by Employee Name..."
      />

      <Limit
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1); // Reset to page 1 on limit change
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              onClick={() => toggleSort("employee_name")}
            >
              Investigator Name
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
                      sortField === "employee_name" && sortOrder === "asc"
                        ? 1
                        : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity:
                      sortField === "employee_name" && sortOrder === "desc"
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
              onClick={() => toggleSort("num_483s_issued")}
            >
              Number of 483s Issued
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
                      sortField === "num_483s_issued" && sortOrder === "asc"
                        ? 1
                        : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity:
                      sortField === "num_483s_issued" && sortOrder === "desc"
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
              Number of Warning Letters Issued
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
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => toggleSort("conversion_rate")}
            >
              Conversion Rate
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
                      sortField === "conversion_rate" && sortOrder === "asc"
                        ? 1
                        : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity:
                      sortField === "conversion_rate" && sortOrder === "desc"
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
              onClick={() => toggleSort("latest_record_date")}
            >
              Last 483 Issued Date
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
                      sortField === "latest_record_date" && sortOrder === "asc"
                        ? 1
                        : 0.5,
                  }}
                >
                  ▲
                </span>
                <span
                  style={{
                    opacity:
                      sortField === "latest_record_date" && sortOrder === "desc"
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
              onClick={() => toggleSort("latest_warning_letter_date")}
            >
              Last Warning Letter Issued Date
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
                      sortField === "latest_warning_letter_date" &&
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
                      sortField === "latest_warning_letter_date" &&
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
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  href={`/investigators/investigator_details?name=${item.employee_name}`}
                  style={{
                    color: "blue",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {item.employee_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  href={`/investigators/investigator_details?name=${item.employee_name}&tab=form483s`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {item.num_483s_issued}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  href={`/investigators/investigator_details?name=${item.employee_name}&tab=warningletters`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {item.warning_letter_count}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {(
                  (item.warning_letter_count / item.num_483s_issued || 0) * 100
                ).toFixed(1)}
                %
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.latest_record_date || "No Date Available"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.latest_warning_letter_date || "---"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={totalPages === 0 ? 0 : page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
