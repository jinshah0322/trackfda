"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/pagination";
import Limit from "@/components/limit";
import Loading from "@/components/loading";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]); // Full fetched data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [loading, setLoading] = useState(true); // Loading state
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [sortField, setSortField] = useState(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/inspectioncitations`
        );
        const result = await response.json();
        setData(result.inspectincitations || []);
        setFilteredData(result.inspectincitations || []);
      } catch (error) {
        console.error("Error fetching inspection citations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === "inspection_end_date") {
      const aDate = new Date(a[sortField]);
      const bDate = new Date(b[sortField]);
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    const aValue = a[sortField]?.toString().toLowerCase() || "";
    const bValue = b[sortField]?.toString().toLowerCase() || "";

    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / limit);

  // Paginate data
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  if (loading) {
    return <Loading />; // Display a loading spinner while data is being fetched
  }

  const renderSortableHeader = (label, field) => (
    <th
      onClick={() => handleSort(field)}
      style={{
        padding: "8px",
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
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Inspection Citations</h1>

      {/* Limit Component */}
      <Limit limit={limit} onLimitChange={handleLimitChange} />

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No inspection citations available.</h2>
        </div>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                {renderSortableHeader("Company Name", "legal_name")}
                {renderSortableHeader("Company Address", "firm_address")}
                <th>FEI Number</th>
                {renderSortableHeader("Inspection End Date", "inspection_end_date")}
                <th>Act/CFR Number</th>
                <th>Short Description</th>
                <th>Long Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.legal_name}</td>
                  <td>{item.firm_address}</td>
                  <td style={{ textDecoration: "none", color: "blue" }}>
                    {item.fei_number}
                  </td>
                  <td>
                    {new Date(item.inspection_end_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td>{item.act_cfr_number}</td>
                  <td>{item.short_description}</td>
                  <td>{item.long_description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            totalRecords={filteredData.length}
          />
        </>
      )}
    </div>
  );
}
