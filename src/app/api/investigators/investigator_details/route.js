import { query } from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const investigator = url.searchParams.get("investigator");

  if (!investigator) {
    return NextResponse.json(
      { error: "Investigator name is required" },
      { status: 400 }
    );
  }

  try {
    const { rows: investigationByYear } = await query(
      `
            SELECT 
                EXTRACT(YEAR FROM record_date) AS year, 
                COUNT(DISTINCT published_483s_id) AS investigations
            FROM published_483s
            WHERE EXISTS (
                SELECT 1
                FROM unnest(investigators) AS inv
                WHERE LOWER(REGEXP_REPLACE(inv, '\\s*\\.\\s*', ' ', 'g')) = LOWER(REGEXP_REPLACE($1, '\\s*\\.\\s*', ' ', 'g'))
            )
            GROUP BY year
            ORDER BY year;
        `,
      [investigator]
    );

    const { rows: facilityDetails_issueDate } = await query(
      `
        SELECT 
            cd.fei_number,
            cd.legal_name, 
            cd.firm_address, 
            STRING_AGG(TO_CHAR(p483s.record_date, 'DD Mon YYYY'), ', ') AS record_dates
        FROM 
            published_483s p483s
        JOIN 
            company_details cd 
        ON 
            p483s.fei_number = cd.fei_number
        WHERE EXISTS (
            SELECT 1
            FROM unnest(p483s.investigators) AS inv
            WHERE LOWER(REGEXP_REPLACE(inv, '\\s*\\.\\s*', ' ', 'g')) = LOWER(REGEXP_REPLACE($1, '\\s*\\.\\s*', ' ', 'g'))
        )
        GROUP BY 
            cd.fei_number,
            cd.legal_name, 
            cd.firm_address
        ORDER BY 
            cd.legal_name;`,
      [investigator]
    );

    return NextResponse.json(
      { overview: { investigationByYear, facilityDetails_issueDate } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
