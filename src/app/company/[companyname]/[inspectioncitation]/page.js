"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Link from "next/link";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";
import "@/app/style.css";

export default function Page({ params }) {
  const companyName = decodeURIComponent(params.companyname);
  const inspectionCitation = params.inspectioncitation;

  const [loading, setLoading] = useState(true);
  const [citationDetails, setCitationDetails] = useState([]);
  const [limit, setLimit] = useState(5); // Default items per page
  const [page, setPage] = useState(1); // Current page

  useEffect(() => {
    const fetchCitationData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/companydetails/inspectioncitations?companyname=${companyName}&inspectioncitation=${inspectionCitation}`
        );
        const data = await response.json();
        console.log(data, "main");
        setCitationDetails(data.inspectionCitationsResult);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(false);
      }
    };

    fetchCitationData();
  }, [companyName, inspectionCitation]);

  const totalPages = Math.ceil(citationDetails.length / limit);

  const paginatedData = citationDetails.slice((page - 1) * limit, page * limit);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href={`/company/${encodeURIComponent(companyName)}`}>
          ← Back to Company Details
        </Link>
      </div>
      <h1>Inspection Citations</h1>

      {/* Header Section */}
      <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        <div style={{ fontSize: "18px", color: "#555", lineHeight: "1.8" }}>
          <p>
            <strong>Company Name: </strong>
            <span style={{ color: "#000" }}>{companyName || "N/A"}</span>
          </p>
          <p>
            <strong>Facility Number: </strong>
            <span style={{ color: "#000" }}>
              {citationDetails[0]?.fei_number || "N/A"}
            </span>
          </p>
          <p>
            <strong>Firm Address: </strong>
            <span style={{ color: "#000" }}>
              {citationDetails[0]?.firm_address || "N/A"}
            </span>
          </p>
        </div>
      </div>  

      {/* Table Section */}
      {paginatedData.length ? (
        <>
          <Limit limit={limit} onLimitChange={handleLimitChange} />
          <table className="data-table">
            <thead>
              <tr>
                <th>Act CFR Number</th>
                <th>Short Description</th>
                <th>Long Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      href={`https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-C/section-${
                        item.act_cfr_number.includes("(")
                          ? item.act_cfr_number.split("(")[0]
                          : item.act_cfr_number
                      }#p-${item.act_cfr_number}`}
                      target="_blank"
                      style={{ color: "blue", textDecoration: "none" }}
                    >
                      {item.act_cfr_number}
                    </Link>
                  </td>
                  <td>{item.short_description}</td>
                  <td>{item.long_description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No citations available for this company.</h2>
        </div>
      )}
    </div>
  );
}
