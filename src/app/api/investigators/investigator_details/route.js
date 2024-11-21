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
    const { rows: investigatorData } = await query(
      `
      SELECT 
          COUNT(DISTINCT p483s.published_483s_id) AS num_483s_issued,
          MAX(p483s.record_date) AS last_record_date
      FROM 
          published_483s p483s
      WHERE EXISTS (
          SELECT 1
          FROM UNNEST(p483s.investigators) AS inv
          WHERE LOWER(REGEXP_REPLACE(inv, '\\s*\\.\\s*', ' ', 'g')) = LOWER(REGEXP_REPLACE($1, '\\s*\\.\\s*', ' ', 'g'))
      );
      `,
      [investigator]
    );

    const { rows: investigationByYear } = await query(
      `
            SELECT 
                EXTRACT(YEAR FROM TO_DATE(record_date, 'DD-MM-YYYY')) AS year, 
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
            STRING_AGG(TO_CHAR(TO_DATE(p483s.record_date, 'DD-MM-YYYY'), 'DD Mon YYYY'), ', ') AS record_dates
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

    const { rows: form483data } = await query(
      `
      SELECT 
        p483s.record_date, 
        cd.legal_name, 
        p483s.download_link
      FROM 
          published_483s p483s
      JOIN 
          company_details cd 
      ON 
          p483s.fei_number = cd.fei_number
      WHERE EXISTS (
          SELECT 1
          FROM unnest(p483s.investigators) AS inv
          WHERE inv = $1
      )
      ORDER BY 
          p483s.record_date DESC;
      `,
      [investigator]
    );

    const { rows: coinvestigators } = await query(
      `
        WITH investigator_records AS (
        SELECT 
            published_483s_id,
            UNNEST(investigators) AS co_investigator
        FROM 
            published_483s
        WHERE 
            EXISTS (
                SELECT 1
                FROM UNNEST(investigators) AS inv
                WHERE LOWER(REGEXP_REPLACE(inv, '\\s*\\.\\s*', ' ', 'g')) = LOWER(REGEXP_REPLACE($1, '\\s*\\.\\s*', ' ', 'g'))
            )
        )
        SELECT 
            co_investigator AS co_investigator_name,
            COUNT(*) AS investigations_done
        FROM 
            investigator_records
        WHERE 
            LOWER(REGEXP_REPLACE(co_investigator, '\\s*\\.\\s*', ' ', 'g')) != LOWER(REGEXP_REPLACE($1, '\\s*\\.\\s*', ' ', 'g'))
        GROUP BY 
            co_investigator
        ORDER BY 
            investigations_done DESC, 
            co_investigator_name;
        `,
      [investigator]
    );

    return NextResponse.json(
      {
        overview: { investigatorData, investigationByYear, facilityDetails_issueDate },
        form483data,
        coinvestigators,
      },
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
