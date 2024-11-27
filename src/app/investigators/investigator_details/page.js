"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/style.css";
import Overview from "@/components/investigatorDetails/overview";
import Loading from "@/components/loading";
import Coinvestigator from "@/components/investigatorDetails/coinvestigator";
import Form483 from "@/components/investigatorDetails/form483";

export default function Page({ searchParams = {} }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [form483Details, setForm483Details] = useState({});
  const [coinvestigator, setCoinvestigator] = useState({});
  const [investigatorData, setInvestigatorData] = useState({});
  const [page, setPage] = useState(1); // Pagination state
  const [limit, setLimit] = useState(10); // Items per page

  // Extract the investigator name from searchParams
  const investigatorName = searchParams.name;

  useEffect(() => {
    if (!investigatorName) {
      console.error("Search parameter `name` is missing.");
      return;
    }

    const fetchInvestigationsByYear = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/investigators/investigator_details?investigator=${investigatorName}`
        );
        const data = await response.json();
        setOverview(data.overview);
        setInvestigatorData(data.overview?.investigatorData[0] || {});
        setForm483Details(data.form483data || {});
        setCoinvestigator(data.coinvestigators || {});
      } catch (error) {
        console.error("Error fetching investigations by year:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchInvestigationsByYear();
  }, [investigatorName]);

  if (!investigatorName) {
    return <div>Error: Investigator name is missing in the search params.</div>;
  }

  if (loading) {
    return <Loading />;
  }

  const { num_483s_issued, last_record_date } = investigatorData;

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/investigators">← Back to Investigator List</Link>
      </div>

      <h1>{investigatorName}</h1>

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
        {activeTab === "form483s" && <Form483 data={form483Details} />}
      </div>
    </div>
  );
}
