"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/style.css";
import Overview from "@/components/investigatorDetails/overview";
import Loading from "@/components/loading";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [investigatorData, setInvestigatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("investigatorData");
    if (storedData) {
      setInvestigatorData(JSON.parse(storedData));
    } else {
      window.location.href = "/investigators";
    }
  }, []);

  useEffect(() => {
    const fetchInvestigationsByYear = async () => {
      setLoading(true);
      if (investigatorData) {
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_BASE_URL
            }/investigators/investigator_details?investigator=${encodeURIComponent(
              investigatorData.name
            )}`
          );
          const data = await response.json();
          if (response.ok && data.overview) {
            setOverview(data.overview);
          }
        } catch (error) {
          console.error("Error fetching investigations by year:", error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      }
    };

    fetchInvestigationsByYear();
  }, [investigatorData]); // Run only when investigatorData changes

  if (!investigatorData) {
    return null;
  }

  const { name, num483sIssued, lastIssuedDate, status } = investigatorData;

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/investigators">← Back to Investigator List</Link>
      </div>

      <h1>{name}</h1>
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
          Form 483's
        </a>
      </div>

      <div className="tab-content">
        {activeTab === "overview" && (
          <Overview data={{ num483sIssued, lastIssuedDate, overview }} />
        )}
        {activeTab === "subsystem" && <div>Subsystem content goes here...</div>}
        {activeTab === "coinvestigators" && (
          <div>Co-Investigators content goes here...</div>
        )}
        {activeTab === "form483s" && <div>Form 483's content goes here...</div>}
      </div>
    </div>
  );
}
