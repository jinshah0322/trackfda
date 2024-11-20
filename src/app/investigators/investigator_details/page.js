"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/style.css";
import Overview from "@/components/investigatorDetails/overview";
import Loading from "@/components/loading";
import Form483sTab from "@/components/companyDetails/form483";
import Coinvestigator from "@/components/investigatorDetails/coinvestigator";

export default function Page({ searchParams }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [form483Details, setForm483Details] = useState({});
  const [coinvestigator, setCoinvestigator] = useState({});
  const [investigatorData, setInvestigatorData] = useState({});
  const [page, setPage] = useState(1); // Pagination state
  const [limit, setLimit] = useState(10); // Items per page

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
        setForm483Details(data.form483data);
        setCoinvestigator(data.coinvestigators);
      } catch (error) {
        console.error("Error fetching investigations by year:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchInvestigationsByYear();
  }, [searchParams]);

  if (loading) {
    return <Loading />;
  }

  // Helper function to transform a date string into a valid Date object
  const transformDate = (dateString) => {
    if (!dateString) return null; // Handle empty or undefined dates
    const parts = dateString.split("-");
    if (parts.length === 3) {
      // Check format based on order of parts
      if (parts[0].length === 4) {
        // Assume YYYY-MM-DD
        return new Date(dateString);
      } else if (parts[2].length === 4) {
        // Assume DD-MM-YYYY
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
    }
    return new Date(dateString); // Fallback to default parsing
  };

  // Calculate status based on `last_record_date`
  const { num_483s_issued, last_record_date } = investigatorData;

  const getStatus = (latestDate) => {
    const latestRecordDate = transformDate(latestDate);

    if (!latestRecordDate || isNaN(latestRecordDate)) {
      return "Invalid Date";
    }

    const currentDate = new Date();
    const monthsDifference =
      (currentDate.getFullYear() - latestRecordDate.getFullYear()) * 12 +
      (currentDate.getMonth() - latestRecordDate.getMonth());

    if (monthsDifference <= 12) {
      return "Active";
    } else if (monthsDifference <= 36) {
      return "Moderately-Active";
    } else {
      return "Inactive";
    }
  };

  const status = last_record_date ? getStatus(last_record_date) : "No Status";

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/investigators">← Back to Investigator List</Link>
      </div>

      <h1>{searchParams.name}</h1>
      <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>

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
          <Coinvestigator
            data={coinvestigator}
            onTabChange={setActiveTab}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
        {activeTab === "form483s" && <Form483sTab data={form483Details} />}
      </div>
    </div>
  );
}
