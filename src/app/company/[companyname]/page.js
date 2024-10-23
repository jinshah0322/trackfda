"use client";

import { useEffect, useState } from "react";
import "@/app/style.css";
import Link from "next/link";

export default function Page({ params }) {
  const [companyData, setCompanyData] = useState({
    fei_number_count: 0,
    warning_letter_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [companyFacilityDeytails, setCompanyFacilityDetails] = useState({});


  async function getCompanyDetails() {
    try {
      let response = await fetch(
        `http://localhost:3000/api/company/companydetails?compnayname=${decodeURIComponent(params.companyname)}`
      );
      return await response.json();
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
  // Retrieve data from localStorage on component mount
  useEffect(() => {
    // Fetch the company details and update the state
    async function fetchCompanyFacilityDetails() {
      // Fetch the company details and update the state
      const companyDetails = await getCompanyDetails();

      if (companyDetails && companyDetails.facilities) {
        // Store the facilities data in state

        const form483Count = countOccurrences(companyDetails.form483Details, 'fei_number');

        // Count warning letter occurrences for each fei_number
        const warningLetterCount = countOccurrences(companyDetails.warningLetters, 'fei_number');
        // Add the count to the corresponding facility object in the facilities array
        const companyFacilities = companyDetails.facilities.map(facility => {
          const feiNumber = facility.fei_number;
          const companyFacilities = {
            ...facility,
            form483_count: form483Count[feiNumber] || 0, // Default to 0 if no match found
            warning_letter_count: warningLetterCount[feiNumber] || 0 // Default to 0 if no match found
          };
          // Replace null or '-' with 'NA'
          return replaceNullAndDashWithNA(companyFacilities);
        });
        setCompanyFacilityDetails(companyFacilities);
      } else {
        console.log("No facilities data found");
      }

      setLoading(false);
    }

    fetchCompanyFacilityDetails();
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
          <p className="card-number">1</p>
        </div>

        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">1</p>
        </div>

        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">1</p>
        </div>

        <div className="card">
          <p className="card-title">Total Warning letters</p>
          <p className="card-number">1</p>
        </div>
      </div>
    </div>
  );
}