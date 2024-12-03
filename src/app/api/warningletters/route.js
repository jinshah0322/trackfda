import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const GET = async (req) => {
  try {
    const { rows } = await query(`WITH matches_483 AS (
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
    ) WHERE w.fei_number !=''
ORDER BY 
    TO_DATE(w.letterissuedate, 'DD-MM-YYYY') DESC;`);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Warning Letter Data:", error);
    return NextResponse.json(
      { error: "Failed to load Warning Letter Data" },
      { status: 500 }
    );
  }
};
