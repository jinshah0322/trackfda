import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";

    // Define the base SQL query with placeholders for dynamic conditions
    let sqlQuery = `
      WITH normalized_data AS (
          SELECT 
              unnest(investigators) AS investigator,
              REGEXP_REPLACE(LOWER(unnest(investigators)), '\\s*\\.\\s*', ' ', 'g') AS normalized_investigator,
              fei_number,
              record_date,
              published_483s_id
          FROM 
              published_483s
      )
      SELECT 
          MIN(investigator) AS investigator,  -- Displays the original name format
          array_agg(DISTINCT fei_number) AS fei_numbers,
          COUNT(DISTINCT published_483s_id) AS num_483s_issued,
          MAX(record_date) AS latest_record_date
      FROM 
          normalized_data
    `;

    // Add WHERE clause conditionally based on the search term
    if (search) {
      sqlQuery += `WHERE normalized_investigator ILIKE '%' || REGEXP_REPLACE(LOWER($1),'\\s*\\.\\s*',' ', 'g') || '%'`;
    }

    // Complete the query with GROUP BY and ORDER BY clauses
    sqlQuery += `
      GROUP BY 
          normalized_investigator
      ORDER BY 
          num_483s_issued desc
    `;

    const params = search ? [search] : [];

    const { rows: investigatorsData } = await query(sqlQuery, params);

    return NextResponse.json({ investigatorsData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Investigator Details:", error);
    return NextResponse.json(
      { error: "Failed to load Investigator Details" },
      { status: 500 }
    );
  }
}
