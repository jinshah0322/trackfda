"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import "@/app/style.css";
import Link from "next/link";
import { AnalysisTab, FacilitiesTab, Form483sTab, WarningLettersTab } from "@/components/companyDetails";

export default function Page({ params }) {
  const [loading, setLoading] = useState(true);
  const [companyFacilityDetails, setCompanyFacilityDetails] = useState({});
  const [companyAnalysisDetails, setCompanyAnalysisDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis"); // State for active tab

  async function getCompanyDetails() {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/companydetails?compnayname=${decodeURIComponent(params.companyname)}`
      );
      response = await response.json();
      setCompanyAnalysisDetails(response.analysis); // Set the entire response
      
      return response; // Return the response for further processing if needed
    } catch (error) {
      console.error("Error fetching company details:", error);
      return null;
    }
  }

  function replaceNullAndDashWithNA(obj) {
    const updatedObj = {};
    for (let key in obj) {
      if (obj[key] === null || obj[key] === '-') {
        updatedObj[key] = 'NA';
      } else {
        updatedObj[key] = obj[key];
      }
    }
    return updatedObj;
  }

  function countOccurrences(array, key) {
    return array.reduce((acc, item) => {
      const feiNumber = item[key];
      acc[feiNumber] = (acc[feiNumber] || 0) + 1;
      return acc;
    }, {});
  }

  useEffect(() => {
    const fetchCompanyFacilityDetails = async () => {
      setLoading(true);
      const companyDetails = await getCompanyDetails();
      
      if (companyDetails && companyDetails.facilities) {
        const form483Count = countOccurrences(companyDetails.form483Details, 'fei_number');
        const warningLetterCount = countOccurrences(companyDetails.warningLetters, 'fei_number');

        const companyFacilities = companyDetails.facilities.map(facility => {
          const feiNumber = facility.fei_number;
          const companyFacility = {
            ...facility,
            form483_count: form483Count[feiNumber] || 0,
            warning_letter_count: warningLetterCount[feiNumber] || 0
          }; 
          return replaceNullAndDashWithNA(companyFacility);
        });
        console.log(companyFacilities,'test')
        setCompanyFacilityDetails(companyFacilities);
      } else {
        console.log("No facilities data found");
      }

      setLoading(false);
    };

    fetchCompanyFacilityDetails();
  }, [params.companyname]);

  if (loading) {
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
        {activeTab === "analysis" && <AnalysisTab data={companyAnalysisDetails} />}
        {activeTab === "facilities" && <FacilitiesTab data={companyFacilityDetails} />}
        {activeTab === "form483s" && <Form483sTab />}
        {activeTab === "warningletters" && <WarningLettersTab />}
      </div>
    </div>
  );
}
