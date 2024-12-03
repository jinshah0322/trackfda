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

    const { rows: importRefusalResult } = await query(
      `
        SELECT fei_number,firm_legal_name,firm_address,product_code_description,refused_date,import_division,
        fda_sample_analysis,private_lab_analysis,refusal_charges 
        FROM import_refusals WHERE firm_legal_name = $1 ORDER BY refused_date DESC
      `,
      [companyname]
    );

    const { rows: importRecallResult } = await query(
      `
        SELECT ir.*,cd.firm_address FROM import_recalls ir 
        LEFT JOIN company_details cd ON ir.fei_number=cd.fei_number
        WHERE cd.legal_name = $1
        ORDER BY center_classification_date DESC
      `,
      [companyname]
    );

    const { rows: investgatorResult } = await query(
      `
      WITH employee_fei_pairs AS (
          SELECT jsonb_object_keys(p483.employees) AS employee_name,p483.fei_number
          FROM published_483s p483
          INNER JOIN company_details cd 
          ON p483.fei_number = cd.fei_number
          WHERE cd.legal_name = $1
      )
      SELECT employee_name,STRING_AGG(fei_number::TEXT, ', ') AS fei_number
      FROM employee_fei_pairs
      GROUP BY employee_name
      ORDER BY employee_name;
      `,
      [companyname]
    );

    const analysis = {
      totalFacilities: companyDetailsResult.length,
      totalInspections: inspectionResult.length,
      totalWarningLetters: warningLetterResult.length,
      totalPublished483s: published483Result.length,
      totalCitations: inspectionCitationResult.length,
      totalRefusals: importRefusalResult.length,
      totalRecalls: importRecallResult.length,
      totalInvestigators: investgatorResult.length,
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
        refusals: importRefusalResult,
        recalls: importRecallResult,
        investigators: investgatorResult,
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
