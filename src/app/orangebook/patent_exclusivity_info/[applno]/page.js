"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Link from "next/link";

export default function Page({ params, searchParams }) {
  const [patentDetails, setPatentDetails] = useState([]);
  const [exclusivityDetails, setExclusivityDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orangebook/patent_exclusivity_info?applno=${params.applno}&appltype=${searchParams.appltype}&productno=${searchParams.productno}`
      );
      const result = await res.json();
      setPatentDetails(result.patentDetails);
      setExclusivityDetails(result.exclusivityDetails);
      setIsLoading(false);
    };
    fetchData();
  }, [params, searchParams]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link
          href={`/orangebook/products/${params.applno}?productno=${searchParams.productno}&appltype=${searchParams.appltype}`}
        >
          ← Back to Product Details
        </Link>
      </div>
      <h1>
        Patent and Exclusivity for:{" "}
        {searchParams.appltype === "A" ? "ANDA" : "NDA"} {params.applno}
      </h1>

      {/* Patent Details Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Product No
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Patent No
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Patent Expiration
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Drug Substance
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Drug Product
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Patent Use Code
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Delist Requested
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Submission Date
            </th>
          </tr>
        </thead>
        <tbody>
          {patentDetails.length > 0 ? (
            patentDetails.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.product_no}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.patent_no}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(item.patent_expire_date).toLocaleDateString(
                    "en-GB"
                  )}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.drug_substance_flag === "Y" ? "DS" : ""}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.drug_product_flag === "Y" ? "DP" : ""}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.patent_use_code}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.delist_flag}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(item.submission_date).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "16px" }}>
                <h2>No patent data available for this product.</h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Exclusivity Details Table */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "30px" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Product No
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Exclusivity Code
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Exclusivity Date
            </th>
          </tr>
        </thead>
        <tbody>
          {exclusivityDetails.length > 0 ? (
            exclusivityDetails.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.product_no}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.exclusivity_code}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(item.exclusivity_date).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "16px" }}>
                <h2>No exclusivity data available for this product.</h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}