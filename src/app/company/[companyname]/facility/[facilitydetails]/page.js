"use client";
import Link from "next/link";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import "@/app/style.css";
import FacilityOverview from "@/components/facilityDetails/facilityoverview";
import Form483sTab from "@/components/companyDetails/form483";
import Complainceactiontimeline from "@/components/facilityDetails/complainceactiontimeline"
import Table from "@/components/table";



export default function Page({ params }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [facilityDetails, setFacilityDetails] = useState(null);
  const [form483Details, setForm483Details] = useState(null);
  const [inspectionDetails, setInspectionDetails] = useState(null);
  const [complianceActionCount, setComplianceActionCount] = useState(null);
  const [complianceAction, setComplianceAction] = useState(null);
  const [importRefusal, setImportRefusal] = useState(null);
  const [subSystemSubpartData,setSubSystmeSubpartData] = useState(null);
  const [subSystemSectionData,setSubSystemSectionData] = useState(null);

  async function getFacilityDetails() {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/companydetails/facilitydetails?fei_number=${params.facilitydetails}`
      );
      response = await response.json();
      setFacilityDetails(response.facilityDetails[0]);
      setInspectionDetails(response.inspectionResult);
      setForm483Details(response.published483Result);
      setComplianceActionCount(response.complianceActionsCount);
      setImportRefusal(response.importRefusals);
      setComplianceAction(response.timeLine);
      setSubSystmeSubpartData(response.subSystemSubpartData);
      setSubSystemSectionData(response.subSystemSectionData);
        return response; // Return the response for further processing if needed
    } catch (error) {
      console.error("Error fetching company details:", error);
      return null;
    }
  }
  const subSystemSubpartDataCloumn= [ { headerName: "Subpart Name", field: "subpartname" },
    { headerName: "Frequency", field: "count" }]
  const subSystemSectionDataCloumn= [ { headerName: "Section Name", field: "sectionname" },
      { headerName: "Frequency", field: "count" }]
  useEffect(() => {
    const fetchFacilityDetails = async () => {
      setLoading(true);
      await getFacilityDetails();
      setLoading(false);
    };
    fetchFacilityDetails();
  }, [params.facilitydetails]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link href={`/company/${decodeURIComponent(params.companyname)}`}>
          ← Back to Company
        </Link>
      </div>
      <h1>{decodeURIComponent(params.companyname)}</h1>

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
          Sub System
        </a>
        <a
          className={`tab ${activeTab === "compliance" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("compliance")}
        >
          Compliance Action
        </a>
        <a
          className={`tab ${activeTab === "form483s" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("form483s")}
        >
          Form 483&apos;s
        </a>
      </div>
      <div className="facility-details-section">
        {activeTab === "overview" && <FacilityOverview data={{ facilityDetails, inspectionDetails,complianceActionCount,importRefusal }} />}
        {activeTab === "form483s" && <Form483sTab data={form483Details} />}
        {activeTab === "compliance" && <Complainceactiontimeline data={complianceAction}/>}
        {activeTab === "subsystem" && <Table data={subSystemSubpartData} columns={subSystemSubpartDataCloumn} tableName={"Subpart"}/>}
        {activeTab === "subsystem" && <Table data={subSystemSectionData} columns={subSystemSectionDataCloumn} tableName={"Section"}/>}
      </div>
    </div>
  );
}
