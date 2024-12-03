import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const GET = async (req) => {
  try {
    const { rows: recentInspectionDetails } = await query(`
        SELECT cd.legal_name,cd.firm_address,cd.fei_number,i.project_area,i.product_type,i.classification,i.posted_citations,i.fiscal_year,i.inspection_end_date,i.inspection_id 
        FROM company_details cd
        RIGHT JOIN inspection_details i 
        ON cd.fei_number = i.fei_number 
        ORDER BY fiscal_year DESC,inspection_end_date DESC 
        LIMIT 10
        `);

    const { rows: recentInspectionCitations } = await query(`
        SELECT cd.legal_name,cd.firm_address,cd.fei_number,icd.inspection_end_date,icd.act_cfr_number,icd.short_description,icd.long_description 
        FROM company_details cd 
        RIGHT JOIN inspections_citations_details icd 
        ON cd.fei_number=icd.fei_number
        ORDER BY inspection_end_date DESC
        LIMIT 10
        `);

    const { rows: recentForm483 } = await query(`
        WITH warning_letter_matches AS (
            SELECT 
                w.fei_number,
                w.warningletterurl,
                w.form483_issue_date,
                w.form483_response_date,
                w.letterissuedate
            FROM 
                warninglettersdetails w
        )
        SELECT 
            p483s.record_date,
            p483s.fei_number,
            p483s.legal_name,
            p483s.download_link,
            COALESCE(wl.warningletterurl, '') AS warningletterurl
        FROM 
            published_483s p483s
        LEFT JOIN warning_letter_matches wl
        ON 
            p483s.fei_number = wl.fei_number
            AND (
                TO_DATE(wl.form483_issue_date, 'DD-MM-YYYY') = TO_DATE(p483s.record_date, 'DD-MM-YYYY')
                OR (
                    TO_DATE(wl.form483_issue_date, 'DD-MM-YYYY') 
                    BETWEEN 
                        TO_DATE(p483s.record_date, 'DD-MM-YYYY') 
                        AND 
                        TO_DATE(p483s.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                )
                OR (
                    TO_DATE(wl.form483_response_date, 'DD-MM-YYYY') 
                    BETWEEN 
                        TO_DATE(p483s.record_date, 'DD-MM-YYYY') 
                        AND 
                        TO_DATE(p483s.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                )
                OR (
                    TO_DATE(wl.letterissuedate, 'DD-MM-YYYY') 
                    BETWEEN 
                        TO_DATE(p483s.record_date, 'DD-MM-YYYY') 
                        AND 
                        TO_DATE(p483s.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                )
            )
        ORDER BY 
            TO_DATE(p483s.record_date, 'DD-MM-YYYY') DESC
        LIMIT 10;
        `);

    const { rows: recentWarningLetters } = await query(`
        WITH matches_483 AS (
            SELECT 
                p483.fei_number,
                p483.record_date,
                p483.download_link
            FROM 
                published_483s p483
        )
        SELECT 
            w.letterissuedate,
            w.companyname,
            w.fei_number,
            w.issuingoffice,
            w.subject,
            w.warningletterurl,
            COALESCE(p483m.download_link, '') AS p483url
        FROM 
            warninglettersdetails w
        LEFT JOIN matches_483 p483m
        ON 
            w.fei_number = p483m.fei_number
            AND (
                TO_DATE(w.letterissuedate, 'DD-MM-YYYY') = TO_DATE(p483m.record_date, 'DD-MM-YYYY')
                OR (
                    TO_DATE(w.letterissuedate, 'DD-MM-YYYY') 
                    BETWEEN 
                        TO_DATE(p483m.record_date, 'DD-MM-YYYY') 
                        AND 
                        TO_DATE(p483m.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                )
                OR (
                    TO_DATE(w.form483_response_date, 'DD-MM-YYYY') 
                    BETWEEN 
                        TO_DATE(p483m.record_date, 'DD-MM-YYYY') 
                        AND 
                        TO_DATE(p483m.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                )
                OR (
                    TO_DATE(w.form483_issue_date, 'DD-MM-YYYY') 
                    BETWEEN 
                        TO_DATE(p483m.record_date, 'DD-MM-YYYY') 
                        AND 
                        TO_DATE(p483m.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                )
            ) where w.fei_number !=''
        ORDER BY 
            TO_DATE(w.letterissuedate, 'DD-MM-YYYY') DESC
        LIMIT 10;
        `);

    const { rows: recentImportRefusals } = await query(`
        SELECT fei_number,firm_legal_name,firm_address,product_code_description,refused_date,import_division,
        fda_sample_analysis,private_lab_analysis,refusal_charges 
        FROM import_refusals ORDER BY refused_date limit 10
        `);

    const { rows: recentImportRecalls } = await query(`
        SELECT ir.*,cd.firm_address FROM import_recalls ir 
        LEFT JOIN company_details cd ON ir.fei_number=cd.fei_number
        ORDER BY center_classification_date DESC limit 10
        `);

    return NextResponse.json(
      {
        recentInspectionDetails,
        recentInspectionCitations,
        recentForm483,
        recentWarningLetters,
        recentImportRefusals,
        recentImportRecalls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Data:", error);
    return NextResponse.json({ error: "Failed to load Data" }, { status: 500 });
  }
};
