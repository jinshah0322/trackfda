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
            TO_CHAR(MAX(TO_DATE(p483s.record_date, 'DD-MM-YYYY')), 'DD-MM-YYYY') AS last_record_date
        FROM 
            published_483s p483s
        WHERE 
            fei_number IN (
                SELECT fei_number 
                FROM company_details
            )
            AND EXISTS (
                SELECT 1
                FROM jsonb_object_keys(p483s.employees) AS employee_name
                WHERE employee_name = $1
            )
      `,
      [investigator]
    );

    const { rows: investigationByYear } = await query(
      `
            SELECT 
                EXTRACT(YEAR FROM TO_DATE(record_date, 'DD-MM-YYYY')) AS year, 
                COUNT(DISTINCT published_483s_id) AS investigations
            FROM published_483s
            WHERE 
                fei_number IN (
                    SELECT fei_number 
                    FROM company_details
                )
                AND EXISTS (
                    SELECT 1
                    FROM jsonb_object_keys(employees) AS employee_name
                    WHERE employee_name = $1
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
            FROM jsonb_object_keys(p483s.employees) AS employee_name
            WHERE employee_name = $1
        )
        GROUP BY 
            cd.fei_number,
            cd.legal_name, 
            cd.firm_address
        ORDER BY 
            cd.legal_name;
`,
      [investigator]
    );

    const { rows: form483data } = await query(
      `
      WITH normalized_data AS (
            SELECT 
                p483s.record_date, 
                p483s.legal_name, 
                p483s.download_link,
                p483s.fei_number,
                p483s.inspection_start_date,
                p483s.inspection_end_date,
                p483s.report_recipient_name,
                p483s.report_recipient_title,
                emp.key AS employee_name, -- Extract employee name (key)
                emp.value AS employee_role -- Extract role (value)
            FROM 
                published_483s p483s,
                LATERAL jsonb_each_text(p483s.employees) AS emp(key, value) -- Extract key-value pairs from employees JSONB
            WHERE 
                p483s.fei_number IN (
                    SELECT fei_number 
                    FROM company_details
                )
        ),
        warning_letter_matches AS (
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
            p483s.report_recipient_name,
            p483s.report_recipient_title,
            COALESCE(wl.warningletterurl, '') AS warningletterurl,
            p483s.employee_name, -- Include employee name
            p483s.employee_role, -- Include employee role
            CASE 
                WHEN p483s.inspection_start_date = '' OR p483s.inspection_end_date = '' THEN 'NA'
                ELSE CONCAT(
                    (TO_DATE(p483s.inspection_end_date, 'DD/MM/YYYY') - TO_DATE(p483s.inspection_start_date, 'DD/MM/YYYY')), ' days'
                )
            END AS inspection_duration
        FROM 
            normalized_data p483s
        LEFT JOIN 
            warning_letter_matches wl
        ON 
            p483s.fei_number = wl.fei_number
        AND (
            -- Match FEI Number and date criteria
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
        WHERE 
            p483s.employee_name = $1 -- Filter by employee name
        ORDER BY 
            p483s.record_date DESC;
      `,
      [investigator]
    );

    const { rows: coinvestigators } = await query(
      `
        WITH employee_records AS (
            SELECT 
                published_483s_id,
                jsonb_object_keys(employees) AS co_employee -- Extract employee names
            FROM 
                published_483s
            WHERE 
                EXISTS (
                    SELECT 1
                    FROM jsonb_object_keys(employees) AS emp
                    WHERE emp = $1 -- Match the specific employee
                )
        )
        SELECT 
            co_employee AS co_employee_name,
            COUNT(*) AS investigations_done
        FROM 
            employee_records
        WHERE 
            LOWER(REGEXP_REPLACE(co_employee, '\\s*\\.\\s*', ' ', 'g')) != LOWER(REGEXP_REPLACE($1, '\\s*\\.\\s*', ' ', 'g')) -- Exclude the given employee
        GROUP BY 
            co_employee
        ORDER BY 
            investigations_done DESC, 
            co_employee_name;
        `,
      [investigator]
    );

    return NextResponse.json(
      {
        overview: {
          investigatorData,
          investigationByYear,
          facilityDetails_issueDate,
        },
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
