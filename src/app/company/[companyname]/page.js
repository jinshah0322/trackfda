// src/app/company/[companyname]/page.js
"use client";

import { useEffect } from "react";
import "@/app/style.css";
import Link from "next/link";
import { useSelector } from 'react-redux';

export default function Page({ params }) {
  const companyData = useSelector((state) => state.company);

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
          <p className="card-number">{companyData.fei_number_count}</p>
        </div>

        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">71</p>
        </div>

        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">7</p>
        </div>

        <div className="card">
          <p className="card-title">Total Warning letters</p>
          <p className="card-number">{companyData.warning_letter_count}</p>
        </div>
      </div>
    </div>
  );
}