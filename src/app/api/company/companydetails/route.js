import { NextResponse } from "next/server";
import { query } from "../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyname = url.searchParams.get("compnayname");

    // Fetch distinct FEI numbers and related details in a single query
    const { rows: companyDetailsResult } = await query(
      `
      SELECT legal_name,fei_number,city,state,country_area,firm_address FROM company_details WHERE legal_name = $1
    `,
      [companyname]
    );

    //Fetch Inspection details for selected company name
    const { rows: inspectionResult } = await query(
        `
        SELECT cd.legal_name,cd.fei_number,i.project_area,i.product_type,i.classification,
        i.posted_citations FROM company_details cd
        INNER JOIN inspection_details i ON cd.fei_number = i.fei_number
        WHERE cd.legal_name = $1
      `,
        [companyname]
      );

    //Fetch published 483 details for the selected company name
    const { rows: published483Result } = await query(
        `
        SELECT cd.legal_name, cd.fei_number, p.date_posted, p.download_link FROM company_details cd
        INNER JOIN published_483s p ON cd.fei_number = p.fei_number
        WHERE cd.legal_name = $1
      `,
        [companyname]
      );
    
    //Fetch warning letter details for the selected company name
    const { rows: warningLetterResult } = await query(
        `
        SELECT cd.fei_number,cd.legal_name,wl.letterissuedate, wl.issuingoffice, wl.subject, 
        wl.warningletterurl FROM company_details cd
        INNER JOIN compliance_actions ca ON cd.fei_number = ca.fei_number
        INNER JOIN warninglettersdetails wl ON ca.case_injunction_id = wl.marcscmsno
        WHERE cd.legal_name = $1
      `,
        [companyname]
      );

    const analysis = {totalFacilities:companyDetailsResult.length,totalInspections:inspectionResult.length,totalWarningLetters:warningLetterResult.length,totalPublished483s:published483Result.length}

    // Return the combined data
    return NextResponse.json(
      {analysis, facilities:companyDetailsResult, form483Details:published483Result, warningLetters:warningLetterResult},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
