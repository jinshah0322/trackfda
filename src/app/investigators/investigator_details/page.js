"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/style.css";
import Overview from "@/components/investigatorDetails/overview";
import Loading from "@/components/loading";
import Coinvestigator from "@/components/investigatorDetails/coinvestigator";
import Form483 from "@/components/investigatorDetails/form483";

export default function Page({ searchParams }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [form483Details, setForm483Details] = useState([]);
  const [coinvestigator, setCoinvestigator] = useState([]);
  const [investigatorData, setInvestigatorData] = useState({});
  const [page, setPage] = useState(1); // Pagination state
  const [limit, setLimit] = useState(10); // Items per page
  const [sortField, setSortField] = useState(""); // Sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order

  useEffect(() => {
    const fetchInvestigationsByYear = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/investigators/investigator_details?investigator=${searchParams.name}`
        );
        const data = await response.json();
        setOverview(data.overview);
        setInvestigatorData(data.overview.investigatorData[0]);
        setForm483Details(data.form483data || []);
        setCoinvestigator(data.coinvestigators || []);
      } catch (error) {
        console.error("Error fetching investigations by year:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchInvestigationsByYear();
  }, [searchParams]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortData = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (Date.parse(aValue) && Date.parse(bValue)) {
        return sortOrder === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
  };

  const renderSortableHeader = (label, field) => (
    <th
      style={{
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "left",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => toggleSort(field)}
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

  if (loading) {
    return <Loading />;
  }

  const { num_483s_issued, last_record_date } = investigatorData;

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/investigators">← Back to Investigator List</Link>
      </div>

      <h1>{searchParams.name}</h1>

      <div className="tabs">
        <a
          className={`tab ${activeTab === "overview" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </a>
        <a
          className={`tab ${activeTab === "subsystem" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("subsystem")}
        >
          Sub Systems
        </a>
        <a
          className={`tab ${
            activeTab === "coinvestigators" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("coinvestigators")}
        >
          Co-Investigators
        </a>
        <a
          className={`tab ${activeTab === "form483s" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("form483s")}
        >
          Form 483&apos;s
        </a>
      </div>

      <div className="tab-content">
        {activeTab === "overview" && (
          <Overview
            data={{ num_483s_issued, last_record_date, overview }}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
        {activeTab === "subsystem" && <div>Subsystem content goes here...</div>}
        {activeTab === "coinvestigators" && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {renderSortableHeader("Co-Investigator Name", "name")}
                  {renderSortableHeader("Cases Handled", "cases")}
                  {renderSortableHeader("Last Activity", "lastActivity")}
                </tr>
              </thead>
              <tbody>
                {sortData(coinvestigator).map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.cases}</td>
                    <td>{item.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "form483s" && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {renderSortableHeader("Form ID", "formId")}
                  {renderSortableHeader("Issue Date", "issueDate")}
                  {renderSortableHeader("Status", "status")}
                </tr>
              </thead>
              <tbody>
                {sortData(form483Details).map((item, index) => (
                  <tr key={index}>
                    <td>{item.formId}</td>
                    <td>{item.issueDate}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
