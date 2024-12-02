export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query } from "../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyname = url.searchParams.get("companyname");

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
        SELECT cd.legal_name,cd.firm_address,cd.fei_number,i.project_area,i.product_type,i.classification,
        i.posted_citations,i.fiscal_year,i.inspection_end_date,i.inspection_id FROM company_details cd
        INNER JOIN inspection_details i ON cd.fei_number = i.fei_number
        WHERE cd.legal_name = $1
      `,
      [companyname]
    );

    const { rows: inspectionCitationResult } = await query(
      `
        SELECT cd.legal_name,cd.fei_number,cd.firm_address,icd.act_cfr_number,icd.short_description,icd.long_description 
        FROM company_details cd
        INNER JOIN inspections_citations_details icd on cd.fei_number=icd.fei_number
        WHERE cd.legal_name = $1
      `,
      [companyname]
    );

    const { rows: inspectionClassification } = await query(
      `select classification,abbrevation from insd_masterclassification`
    );

    //Fetch published 483 details for the selected company name
    const { rows: published483Result } = await query(
      `
        SELECT cd.legal_name, cd.firm_address, cd.fei_number, p.record_date, p.download_link, p.inspection_start_date, p.inspection_end_date,
          CASE 
              WHEN inspection_start_date = '' OR inspection_end_date = '' THEN 'NA'
              ELSE CONCAT(
                  (TO_DATE(inspection_end_date, 'DD/MM/YYYY') - TO_DATE(inspection_start_date, 'DD/MM/YYYY')), ' days'
              )
          END AS inspection_duration
        FROM company_details cd
        INNER JOIN published_483s p ON cd.fei_number = p.fei_number
        WHERE cd.legal_name = $1;

      `,
      [companyname]
    );

    //Fetch warning letter details for the selected company name
    const { rows: warningLetterResult } = await query(
      `
        SELECT cd.legal_name,cd.fei_number,cd.firm_address,wl.letterissuedate, wl.issuingoffice, wl.subject, 
        wl.warningletterurl FROM company_details cd
        INNER JOIN warninglettersdetails wl ON cd.fei_number = wl.fei_number
        WHERE cd.legal_name = $1
      `,
      [companyname]
    );

    const analysis = {
      totalFacilities: companyDetailsResult.length,
      totalInspections: inspectionResult.length,
      totalWarningLetters: warningLetterResult.length,
      totalPublished483s: published483Result.length,
      totalCitations: inspectionCitationResult.length,
    };

    // Return the combined data
    return NextResponse.json(
      {
        analysis,
        facilities: companyDetailsResult,
        form483Details: published483Result,
        warningLetters: warningLetterResult,
        inspections: inspectionResult,
        citations: inspectionCitationResult,
        inspectionClassification,
      },
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
