"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import Limit from "@/components/limit"; // Using your existing Limit component
import Pagination from "@/components/pagination"; // Using your existing Pagination component
import Loading from "@/components/loading";
import Link from "next/link";

const Page = () => {
  const [filters, setFilters] = useState({
    year: "All",
    companyName: "",
  });

  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [years, setYears] = useState([]); // State for unique years

  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page

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
        const yearOptions = [
          { value: "All", label: "All" },
          ...uniqueYears.map((year) => ({ value: year, label: year })),
        ];
        setYears(yearOptions);
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

        return yearMatches && companyNameMatches;
      });
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, data]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/"
          style={{ textDecoration: "none", color: "#007bff" }}
        >
          ← Back to Dashboard
        </Link>
      </div>
      <h1
        style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}
      >
        Recent Form 483s
      </h1>

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
          <Select
            options={years}
            value={years.find((option) => option.value === filters.year)}
            onChange={(option) =>
              handleFilterChange("year", option?.value || "")
            }
          />
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
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Issue Date</th>
              <th style={{ padding: "8px" }}>Company Name</th>
              <th style={{ padding: "8px" }}>483 Analysis</th>
              <th style={{ padding: "8px" }}>Converted to Warning Letter</th>
              <th style={{ padding: "8px" }}>Warning Letter Analysis</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px" }}>{row.record_date}</td>
                  <td style={{ padding: "8px" }}>{row.legal_name}</td>
                  <td style={{ padding: "8px" }}>
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
                  <td style={{ padding: "8px" }}>
                    {row.warningletterurl === "" ? "---" : "✓"}
                  </td>
                  <td style={{ padding: "8px" }}>
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
};

export default Page;
