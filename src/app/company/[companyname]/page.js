"use client";

import { useEffect, useState } from "react";
import "@/app/style.css";
import Link from "next/link";

export default function Page({ params }) {
  const [companyData, setCompanyData] = useState({});

  useEffect(() => {
    const savedCompanyData = localStorage.getItem("companyData");
    if (savedCompanyData) {
      setCompanyData(JSON.parse(savedCompanyData));
    }
  }, []);

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
        <a className="tab active-tab">Analysis</a>
        <a className="tab">Facilities</a>
        <a className="tab">Form 483s</a>
      </div>

      {/* Cards */}
      <div className="cards-container">
        <div className="card">
          <p className="card-title">Total Facilities</p>
          <p className="card-number">{companyData.fei_number_count || 0}</p>
        </div>

        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">6</p>
        </div>

        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">1</p>
        </div>

        <div className="card">
          <p className="card-title">Total Warning letters</p>
          <p className="card-number">{companyData.warning_letter_count || 0}</p>
        </div>
      </div>
    </div>
  );
}