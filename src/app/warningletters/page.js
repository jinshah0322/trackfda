"use client";

import React, { useEffect, useState } from "react";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";
import Loading from "@/components/loading";
import Link from "next/link";

export default function Page() {
  const [filters, setFilters] = useState({
    year: "All",
    companyName: "",
    hasForm483: "All", // New filter for Form 483
  });
  const [data, setData] = useState([]); // Full fetched data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [loading, setLoading] = useState(true); // Loading state
  const [years, setYears] = useState([]); // List of years for filtering
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState(""); // Sort order

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/warningletters`
        );
        const result = await response.json();
        const rawData = result.data || [];
        setData(rawData);
        setFilteredData(rawData);

        // Extract unique years from `letterissuedate`
        const uniqueYears = Array.from(
          new Set(
            rawData
              .map((item) => {
                const date = new Date(
                  item.letterissuedate.split("/").reverse().join("-")
                ); // Convert DD/MM/YYYY to YYYY-MM-DD
                return !isNaN(date) ? date.getFullYear().toString() : null;
              })
              .filter((year) => year !== null)
          )
        ).sort((a, b) => b - a);

        // Add "All" option at the top
        setYears(["All", ...uniqueYears]);
      } catch (error) {
        console.error("Error fetching warning letters data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filtering logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { year, companyName, hasForm483 } = filters;
      const searchTerm = companyName.toLowerCase();

      const filtered = data.filter((item) => {
        const yearMatches =
          year === "All" ||
          new Date(item.letterissuedate.split("/").reverse().join("-"))
            .getFullYear()
            .toString() === year;

        const companyNameMatches =
          !searchTerm || item.companyname.toLowerCase().includes(searchTerm);

        const form483Matches =
          hasForm483 === "All" ||
          (hasForm483 === "Yes" && item.p483url !== "") ||
          (hasForm483 === "No" && item.p483url === "");

        return yearMatches && companyNameMatches && form483Matches;
      });

      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, data]);

  // Sorting logic
  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortData = (data) => {
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      if (sortField === "letterissuedate") {
        const aDate = new Date(a[sortField].split("/").reverse().join("-"));
        const bDate = new Date(b[sortField].split("/").reverse().join("-"));
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortData(filteredData).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderSortableHeader = (label, field) => (
    <th
      onClick={() => toggleSort(field)}
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
  );

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/recentdata">← Back to Dashboard</Link>
      </div>
      <h1>Warning Letters</h1>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Issue Year:
          </label>
          <select
            value={filters.year}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, year: e.target.value }))
            }
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Company Name:
          </label>
          <input
            type="text"
            placeholder="Enter company name"
            value={filters.companyName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, companyName: e.target.value }))
            }
            style={{
              padding: "8px",
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Form 483:
          </label>
          <select
            value={filters.hasForm483}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, hasForm483: e.target.value }))
            }
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
            }}
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Limit Component */}
      <Limit
        limit={itemsPerPage}
        onLimitChange={(newLimit) => {
          setItemsPerPage(newLimit);
          setCurrentPage(1); // Reset to first page
        }}
      />

      {/* Table */}
      {loading ? (
        <Loading />
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
              <th style={{ padding: "8px", width: "150px" }}>FEI Number</th>
              {renderSortableHeader("Company Name", "companyname")}
              {renderSortableHeader("Issue Date", "letterissuedate")}
              {renderSortableHeader("Issuing Office", "issuingoffice")}
              <th style={{ padding: "8px", width: "150px" }}>Subject</th>
              <th style={{ padding: "8px", width: "150px" }}>Warning Letter</th>
              <th style={{ padding: "8px", width: "150px" }}>Form 483</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} style={{ padding: "8px" }}>
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
                  <td style={{ padding: "8px" }}>{item.companyname}</td>
                  <td style={{ padding: "8px" }}>{item.letterissuedate}</td>
                  <td style={{ padding: "8px" }}>{item.issuingoffice}</td>
                  <td style={{ padding: "8px" }}>{item.subject}</td>
                  <td style={{ padding: "8px" }}>
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
                  <td style={{ padding: "8px" }}>
                    {item.p483url === "" ? (
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
                        onClick={() => window.open(item.p483url, "_blank")}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    color: "#888",
                  }}
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
        totalRecords={filteredData.length}
      />
    </div>
  );
}
