"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import "@/app/style.css";
import Link from "next/link";
import {AnalysisTab,FacilitiesTab,Form483sTab,WarningLettersTab} from "@/components/companyDetails";

export default function Page({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis"); // State for active tab

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/companydetails?compnayname=${params.companyname}`
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.companyname]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link href="/company">← Back to Company List</Link>
      </div>
      <h1 className="company-title">
        {decodeURIComponent(params.companyname)}
      </h1>

      {/* Tabs */}
      <div className="tabs">
        <a
          className={`tab ${activeTab === "analysis" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </a>
        <a
          className={`tab ${activeTab === "facilities" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("facilities")}
        >
          Facilities
        </a>
        <a
          className={`tab ${activeTab === "form483s" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("form483s")}
        >
          Form 483s
        </a>
        <a
          className={`tab ${activeTab === "warningletters" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("warningletters")}
        >
          Warning Letters
        </a>
      </div>

      {/* Tab Content */}
      <div className="cards-container">
        {activeTab === "analysis" && <AnalysisTab data={data.analysis}/>}
        {activeTab === "facilities" && <FacilitiesTab />}
        {activeTab === "form483s" && <Form483sTab />}
        {activeTab === "warningletters" && <WarningLettersTab />}
      </div>
    </div>
  );
}