export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";

    // Base SQL query
    let sqlQuery = `
      WITH normalized_data AS (
          SELECT 
              jsonb_object_keys(employees) AS employee_name,
              REGEXP_REPLACE(LOWER(jsonb_object_keys(employees)), '\\s*\\.\\s*', ' ', 'g') AS normalized_employee_name,
              fei_number,
              record_date,
              published_483s_id
          FROM 
              published_483s
          WHERE 
              fei_number IN (
                  SELECT fei_number 
                  FROM company_details
              )
      ),
      warning_letter_counts AS (
          SELECT 
              LOWER(nd.employee_name) AS employee_name,
              COUNT(*) AS total_warning_letters
          FROM 
              normalized_data nd
          INNER JOIN 
              warninglettersdetails w
          ON 
              nd.fei_number = w.fei_number
              AND (
                  (
                      TO_DATE(w.form483_issue_date, 'DD-MM-YYYY') = TO_DATE(nd.record_date, 'DD-MM-YYYY')
                      OR (
                          TO_DATE(w.form483_issue_date, 'DD-MM-YYYY') 
                          BETWEEN 
                              TO_DATE(nd.record_date, 'DD-MM-YYYY') 
                              AND 
                              TO_DATE(nd.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                      )
                  )
                  OR (
                      TO_DATE(w.form483_response_date, 'DD-MM-YYYY') 
                      BETWEEN 
                          TO_DATE(nd.record_date, 'DD-MM-YYYY') 
                          AND 
                          TO_DATE(nd.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                  )
                  OR (
                      TO_DATE(w.letterissuedate, 'DD-MM-YYYY') 
                      BETWEEN 
                          TO_DATE(nd.record_date, 'DD-MM-YYYY') 
                          AND 
                          TO_DATE(nd.record_date, 'DD-MM-YYYY') + INTERVAL '6 months'
                      )
              )
          GROUP BY 
              LOWER(nd.employee_name)
      )
      SELECT 
          MIN(nd.employee_name) AS employee_name, 
          array_agg(DISTINCT nd.fei_number) AS fei_numbers,
          COUNT(DISTINCT nd.published_483s_id) AS num_483s_issued,
          TO_CHAR(MAX(TO_DATE(nd.record_date, 'DD-MM-YYYY')), 'DD-MM-YYYY') AS latest_record_date,
          COALESCE(wc.total_warning_letters, 0) AS warning_letter_count
      FROM 
          normalized_data nd
      LEFT JOIN 
          warning_letter_counts wc
      ON 
          LOWER(nd.employee_name) = wc.employee_name
    `;

    // Add WHERE clause dynamically if a search term is provided
    const params = [];
    if (search) {
      sqlQuery += `
          WHERE normalized_employee_name ILIKE '%' || $1 || '%'
      `;
      params.push(search);
    }

    // Complete the query with GROUP BY and ORDER BY
    sqlQuery += `
      GROUP BY 
          LOWER(nd.employee_name), wc.total_warning_letters
      ORDER BY 
          warning_letter_count DESC, num_483s_issued DESC
    `;

    // Execute the query
    const { rows: employeesData } = await query(sqlQuery, params);

    // Return results as JSON
    return NextResponse.json({ employeesData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Employee Details:", error);
    return NextResponse.json(
      { error: "Failed to load Employee Details" },
      { status: 500 }
    );
  }
}
