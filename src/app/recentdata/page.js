"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/loading";

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inspectiondetails");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recentdata`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching recent data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const renderInspectionDetails = () => {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/inspectiondetails">View More</Link>
        </div>
        <table
          className="data-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>FEI Number</th>
              <th>Classification</th>
              <th>Product Type</th>
              <th>Project Area</th>
              <th>Fiscal Year</th>
              <th>Inspection End Date</th>
              <th>Inspection Citations</th>
            </tr>
          </thead>
          <tbody>
            {data.recentInspectionDetails.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{item.legal_name}</td>
                <td>{item.firm_address}</td>
                <td>
                  <Link
                    href={`/company/${encodeURIComponent(
                      item.legal_name
                    )}/facility/${item.fei_number}`}
                    style={{
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    {item.fei_number}
                  </Link>
                </td>
                <td>{item.classification}</td>
                <td>{item.product_type}</td>
                <td>{item.project_area}</td>
                <td>{item.fiscal_year}</td>
                <td>
                  {new Date(item.inspection_end_date).toLocaleDateString()}
                </td>
                <td>
                  {item.posted_citations.toLowerCase() === "yes" ? (
                    <Link
                      href={`/company/${encodeURIComponent(item.legal_name)}/${
                        item.inspection_id
                      }`}
                    >
                      <button
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </Link>
                  ) : (
                    "---"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const renderInspectionCitations = () => {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/inspectioncitations">View More</Link>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>FEI Number</th>
              <th>Inspection End Date</th>
              <th>Act/CFR Number</th>
              <th>Short Description</th>
              <th>Long Description</th>
            </tr>
          </thead>
          <tbody>
            {data.recentInspectionCitations.map((item, index) => (
              <tr key={index}>
                <td>{item.legal_name}</td>
                <td>{item.firm_address}</td>
                <td style={{ textDecoration: "none", color: "blue" }}>
                  <Link
                    href={`/company/${encodeURIComponent(
                      item.legal_name
                    )}/facility/${item.fei_number}`}
                    style={{
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    {item.fei_number}
                  </Link>
                </td>
                <td>
                  {new Date(item.inspection_end_date).toLocaleDateString(
                    "en-GB"
                  )}
                </td>
                <td>{item.act_cfr_number}</td>
                <td>{item.short_description}</td>
                <td>{item.long_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const renderForm483 = () => {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/form483">View More</Link>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Issue Date</th>
              <th>Company Name</th>
              <th>Form483</th>
              <th>Converted to Warning Letter</th>
              <th>Warning Letter</th>
            </tr>
          </thead>
          <tbody>
            {data.recentForm483.map((row, index) => (
              <tr key={index}>
                <td>{row.record_date}</td>
                <td>{row.legal_name}</td>
                <td>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(row.download_link, "_blank")}
                  >
                    View
                  </button>
                </td>
                <td>{row.warningletterurl === "" ? "---" : "✓"}</td>
                <td>
                  {row.warningletterurl === "" ? (
                    "---"
                  ) : (
                    <button
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(row.warningletterurl, "_blank")
                      }
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const renderWarningLetters = () => {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/warningletters">View More</Link>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
              <th>Issue Date</th>
              <th>Company Name</th>
              <th>Issuing Office</th>
              <th style={{ padding: "8px", width: "150px" }}>Subject</th>
              <th style={{ padding: "8px", width: "150px" }}>Warning Letter</th>
              <th style={{ padding: "8px", width: "150px" }}>Form 483</th>
            </tr>
          </thead>
          <tbody>
            {data.recentWarningLetters.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{item.letterissuedate}</td>
                <td style={{ padding: "8px" }}>{item.companyname}</td>
                <td style={{ padding: "8px" }}>{item.issuingoffice}</td>
                <td style={{ padding: "8px" }}>{item.subject}</td>
                <td style={{ padding: "8px" }}>
                  {item.warningletterurl === "" ? (
                    "---"
                  ) : (
                    <button
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(item.warningletterurl, "_blank")
                      }
                    >
                      View
                    </button>
                  )}
                </td>
                <td style={{ padding: "8px" }}>
                  {item.p483url === "" ? (
                    "---"
                  ) : (
                    <button
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(item.p483url, "_blank")}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const renderImportRefusals = () => {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/importrefusals">View More</Link>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>FEI Number</th>
              <th>Product Code Description</th>
              <th>Refusal Date</th>
              <th>Import Division</th>
              <th>FDA Sample Analysis</th>
              <th>Private Lab Analysis</th>
              <th>Refusal Charges</th>
            </tr>
          </thead>
          <tbody>
            {data.recentImportRefusals.map((item, index) => (
              <tr key={index}>
                <td>{item.firm_legal_name}</td>
                <td>{item.firm_address}</td>
                <td style={{ textDecoration: "none", color: "blue" }}>
                  <Link
                    href={`/company/${encodeURIComponent(
                      item.firm_legal_name
                    )}/facility/${item.fei_number}`}
                    style={{
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    {item.fei_number}
                  </Link>
                </td>
                <td>{item.product_code_description}</td>
                <td>
                  {new Date(item.refused_date).toLocaleDateString("en-GB")}
                </td>
                <td>{item.import_division}</td>
                <td>{item.fda_sample_analysis}</td>
                <td>{item.private_lab_analysis}</td>
                <td>{item.refusal_charges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const renderImportRecalls = () => {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/importrecalls">View More</Link>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Firm Address</th>
              <th>FEI Number</th>
              <th>Classification</th>
              <th>Status</th>
              <th>Distribution Pattern</th>
              <th>Recall Date</th>
              <th>Reason for Recall</th>
              <th>Product Description</th>
              <th>Event ID</th>
              <th>Event Classification</th>
              <th>Product ID</th>
              <th>Recall Details</th>
            </tr>
          </thead>
          <tbody>
            {data.recentImportRecalls.map((item, index) => (
              <tr key={index}>
                <td>{item.recalling_firm_name}</td>
                <td>{item.firm_address}</td>
                <td style={{ textDecoration: "none", color: "blue" }}>
                  <Link
                    href={`/company/${encodeURIComponent(
                      item.recalling_firm_name
                    )}/facility/${item.fei_number}`}
                    style={{
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    {item.fei_number}
                  </Link>
                </td>
                <td>{item.product_classification}</td>
                <td>{item.status}</td>
                <td>{item.distribution_pattern}</td>
                <td>
                  {new Date(item.center_classification_date).toLocaleDateString(
                    "en-GB"
                  )}
                </td>
                <td>{item.reason_for_recall}</td>
                <td>{item.product_description}</td>
                <td>{item.event_id}</td>
                <td>{item.event_classification}</td>
                <td>{item.product_id}</td>
                <td>
                  <a
                    href={item.recall_details}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "blue",
                      textDecoration: "none",
                    }}
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "inspectiondetails":
        return renderInspectionDetails();
      case "inspectioncitations":
        return renderInspectionCitations();
      case "form483s":
        return renderForm483();
      case "warningletters":
        return renderWarningLetters();
      case "importrefusals":
        return renderImportRefusals();
      case "importrecalls":
        return renderImportRecalls();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/">← Back to Dashboard</Link>
        </div>
        <h1>Recent Data</h1>
        <p>No recent data available.</p>
      </>
    );
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Recent Data</h1>

      {/* Tabs */}
      <div className="tabs">
        <a
          className={`tab ${
            activeTab === "inspectiondetails" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("inspectiondetails")}
        >
          Inspection Details
        </a>
        <a
          className={`tab ${
            activeTab === "inspectioncitations" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("inspectioncitations")}
        >
          Inspection Citations
        </a>
        <a
          className={`tab ${activeTab === "form483s" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("form483s")}
        >
          Form 483s
        </a>
        <a
          className={`tab ${
            activeTab === "warningletters" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("warningletters")}
        >
          Warning Letters
        </a>
        <a
          className={`tab ${
            activeTab === "importrefusals" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("importrefusals")}
        >
          Import Refusals
        </a>
        <a
          className={`tab ${activeTab === "importrecalls" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("importrecalls")}
        >
          Import Recalls
        </a>
      </div>

      <div className="recent">{renderTabContent()}</div>
    </>
  );
}
