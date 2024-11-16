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
  const [investigatorData, setInvestigatorData] = useState({})

  useEffect(() => {
    const fetchInvestigationsByYear = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/investigators/investigator_details?investigator=${searchParams.name}`
        );
        const data = await response.json();
        setOverview(data.overview);
        setInvestigatorData(data.overview.investigatorData[0])
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
  
  const {num_483s_issued,last_record_date} = investigatorData
  
  let status = "";
  if (last_record_date) {
    const currentYear = new Date().getFullYear();
    const recordYear = new Date(last_record_date).getFullYear();

    if (recordYear === currentYear) {
      status = "Active";
    } else if (recordYear === currentYear - 1 || recordYear === currentYear - 2) {
      status = "Moderately-Active";
    } else {
      status = "Inactive";
    }
  }

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
          className={`tab ${activeTab === "coinvestigators" ? "active-tab" : ""}`}
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
          <Overview data={{ num_483s_issued, last_record_date, overview }} />
        )}
        {activeTab === "subsystem" && <div>Subsystem content goes here...</div>}
        {activeTab === "coinvestigators" && (
          <Coinvestigator data={coinvestigator} onTabChange={setActiveTab}/>
        )}
        {activeTab === "form483s" && <Form483sTab data={form483Details} />}
      </div>
    </div>
  );
}
