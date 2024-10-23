"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import "@/app/style.css";
import Link from "next/link";

export default function Page({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

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
  }, [params.companyname]); // Adding the dependency array to prevent infinite re-rendering

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
        <a className="tab active-tab">Analysis</a>
        <a className="tab">Facilities</a>
        <a className="tab">Form 483s</a>
      </div>

      {/* Cards */}
      <div className="cards-container">
        <div className="card">
          <p className="card-title">Total Facilities</p>
          <p className="card-number">
            {data?.totalFacilities}
          </p>
        </div>

        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">
            {data?.totalInspections}
          </p>
        </div>

        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">
            {data?.totalPublished483s}
          </p>
        </div>

        <div className="card">
          <p className="card-title">Total Warning letters</p>
          <p className="card-number">
            {data?.totalWarningLetters}
          </p>
        </div>
      </div>
    </div>
  );
}
