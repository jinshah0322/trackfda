import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const GET = async (req) => {
  try {
    const { rows } = await query(`
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
          TO_DATE(p483s.record_date, 'DD-MM-YYYY') DESC;
    `);

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Failed to load company data" },
      { status: 500 }
    );
  }
};
