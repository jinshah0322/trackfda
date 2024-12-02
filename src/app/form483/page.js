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
    conversion: "All", // Conversion filter
  });
  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [years, setYears] = useState([]); // State for unique years

  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page

  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState(""); // Sorting order

  async function getFrom483() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/from483`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFrom483();
        const rawData = result.data || [];
        setData(rawData);
        setFilteredData(rawData);

        // Extract unique years from record_date
        const uniqueYears = Array.from(
          new Set(
            rawData
              .map((item) => {
                const date = new Date(item.record_date);
                return !isNaN(date) ? date.getFullYear().toString() : null;
              })
              .filter((year) => year !== null)
          )
        ).sort((a, b) => b - a);

        // Add "All" option at the top of the list
        setYears(["All", ...uniqueYears]);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "conversion") {
      setSortField("converted");
      setSortOrder(value === "Converted" ? "asc" : "desc");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchTerm = filters.companyName.toLowerCase();

      const filtered = data.filter((item) => {
        const yearMatches =
          filters.year === "All" ||
          new Date(item.record_date).getFullYear().toString() === filters.year;

        const companyNameMatches =
          !searchTerm || item.legal_name.toLowerCase().includes(searchTerm);

        const conversionMatches =
          filters.conversion === "All" ||
          (filters.conversion === "Converted" &&
            item.warningletterurl !== "") ||
          (filters.conversion === "Not Converted" &&
            item.warningletterurl === "");

        return yearMatches && companyNameMatches && conversionMatches;
      });

      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, data]);

  const toggleSort = (field) => {
    setSortField(field);

    if (field === "converted") {
      setSortOrder((prevOrder) => {
        const newOrder = prevOrder === "asc" ? "desc" : "asc";

        // Update the dropdown to reflect the sorting
        setFilters((prevFilters) => ({
          ...prevFilters,
          conversion: newOrder === "asc" ? "Converted" : "Not Converted",
        }));

        return newOrder;
      });
    } else {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    }
  };

  const sortData = (data) => {
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle date sorting
      if (sortField === "record_date") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);

        if (!isNaN(aDate) && !isNaN(bDate)) {
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        }
        if (isNaN(aDate)) return 1;
        if (isNaN(bDate)) return -1;
      }

      // Handle conversion status sorting
      if (sortField === "converted") {
        const aConverted = a.warningletterurl !== "" ? 1 : 0;
        const bConverted = b.warningletterurl !== "" ? 1 : 0;
        return sortOrder === "asc"
          ? aConverted - bConverted
          : bConverted - aConverted;
      }

      // Handle string sorting
      return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
  };

  // Pagination Logic
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
        width: "150px", // Fixed column width
        textAlign: "left",
        position: "relative",
        cursor: "pointer", // Make it look clickable
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
      <h1>Form 483s</h1>

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
            onChange={(e) => handleFilterChange("year", e.target.value)}
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
            onChange={(e) => handleFilterChange("companyName", e.target.value)}
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
            Conversion Status:
          </label>
          <select
            value={filters.conversion}
            onChange={(e) => handleFilterChange("conversion", e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
            }}
          >
            <option value="All">All</option>
            <option value="Converted">Converted To Warning Letter</option>
            <option value="Not Converted">Not Converted</option>
          </select>
        </div>
      </div>

      {/* Limit Component */}
      <div style={{ marginBottom: "20px" }}>
        <Limit
          limit={itemsPerPage}
          onLimitChange={(newLimit) => {
            setItemsPerPage(newLimit);
            setCurrentPage(1); // Reset to first page when limit changes
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <Loading />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table
          style={{
            width: "65%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
              {renderSortableHeader("Issue Date", "record_date")}
              {renderSortableHeader("Company Name", "legal_name")}
              <th style={{ padding: "8px", width: "150px" }}>Form483</th>
              {renderSortableHeader(
                "Converted to Warning Letter",
                "warningletterurl"
              )}
              <th style={{ padding: "8px", width: "150px" }}>Warning Letter</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px", width: "150px" }}>
                    {row.record_date}
                  </td>
                  <td style={{ padding: "8px", width: "150px" }}>
                    {row.legal_name}
                  </td>
                  <td style={{ padding: "8px", width: "150px" }}>
                    <button
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(row.download_link, "_blank")}
                    >
                      View
                    </button>
                  </td>
                  <td style={{ padding: "8px", width: "150px" }}>
                    {row.warningletterurl === "" ? "---" : "✓"}
                  </td>
                  <td style={{ padding: "8px", width: "150px" }}>
                    {row.warningletterurl === "" ? (
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
                          window.open(row.warningletterurl, "_blank")
                        }
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
                  colSpan="5"
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

      {/* Pagination Component */}
      <div>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
}
