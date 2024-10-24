"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Link from "next/link";
import '@/app/style.css'

export default function Page({ params }) {
  const companyName = decodeURIComponent(params.companyname);
  const inspectionCitation = params.inspectioncitation;

  async function getCitationDetails() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/companydetails/inspectioncitations?companyname=${companyName}&inspectioncitation=${inspectionCitation}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching company details:", error);
      return null;
    }
  }

  const [loading, setLoading] = useState(true);
  const [citationDetails, setCitationDetails] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCitationData = async () => {
      const data = await getCitationDetails();      
      if (isMounted) {
        setCitationDetails(data);
        setLoading(false);
      }
    };
    fetchCitationData();
    return () => {
      isMounted = false;
    };
  }, [companyName, inspectionCitation]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
        <div className="breadcrumb">
        <Link href={`/company/${encodeURIComponent(companyName)}`}>← Back to Company Details</Link>
      </div>
      <h1>Inspection Citation</h1>
      {citationDetails.inspectionCitationsResult.length!==0 ? (
        <pre>{JSON.stringify(citationDetails, null, 2)}</pre>
      ) : (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No facilities available for this company.</h2>
        </div>
      )}
    </div>
  );
}
