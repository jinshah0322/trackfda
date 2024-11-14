import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function POST(req) {
    const reqData = await req.json();
    const { companyNames, years } = reqData;
    const values = [...companyNames, `${years.fromYear}-01-01`, `${years.toYear}-12-31`];
    const placeholders = companyNames.map((_, i) => `$${i + 1}`).join(', ');
    const inspectionQuery = `
    SELECT 
        cd.legal_name, 
        COUNT(id.inspection_id) AS total_inspections,
        COUNT(CASE WHEN id.classification = 'VAI' THEN 1 END) AS vai_count,
        COUNT(CASE WHEN id.classification = 'NAI' THEN 1 END) AS nai_count,
        COUNT(CASE WHEN id.classification = 'OAI' THEN 1 END) AS oai_count
    FROM 
        company_details cd
    LEFT JOIN 
        inspection_details id 
    ON 
        cd.fei_number = id.fei_number
        AND (id.inspection_end_date BETWEEN $${companyNames.length + 1} AND $${companyNames.length + 2})
    WHERE 
        cd.legal_name IN (${placeholders})
    GROUP BY 
        cd.legal_name;
    `;
    
    const from483Query=`
    SELECT 
            cd.legal_name,
            COALESCE(COUNT(fp.date_posted), 0) AS total_from483,
            MAX(fp.date_posted) AS last_date_posted
        FROM 
            company_details cd
        LEFT JOIN
            published_483s fp
        ON 
            cd.fei_number = fp.fei_number
        WHERE 
            cd.legal_name IN (${placeholders})
            AND (fp.date_posted BETWEEN $${companyNames.length + 1} AND $${companyNames.length + 2} OR fp.date_posted IS NULL)
        GROUP BY 
            cd.legal_name;

`;
   const investigatorsQuery=`
   
   `
   
try {
    const { rows :inspection} = await query(inspectionQuery, values);
    const inspectionMratic = inspection.map(item => ({
        legal_name: item.legal_name,
        "Total Inspections": item.total_inspections,
        "No Action Indicated (NAI)": item.nai_count,
        "Voluntary Action Indicated (VAI)": item.vai_count,
        "Official Action Indicated (OAI)": item.oai_count
      }));
    const { rows :from483s} = await query(from483Query, values);
    const from483sMartic = from483s.map(item => ({
        legal_name: item.legal_name,
        "Total Form 483s Issued": item.total_from483,
        "Last from483 issued": item.last_date_posted
        ? new Date(item.last_date_posted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : ''
      }));
    return NextResponse.json({inspectionMratic,from483sMartic
    },{status:200});
} catch (error) {
    console.error('Error executing query', error);
    throw error;
}
}

export async function GET(req) {
    try {
        // Query the database to get the company names
        const { rows: companyNameList } = await query(
            `SELECT legal_name FROM company_details`
        );

        // Send back the list of company names with a 200 status
        return NextResponse.json(companyNameList, { status: 200 });
    } catch (error) {
        console.error("Error fetching company names:", error);
        return NextResponse.json(
            { error: "Failed to fetch company names" },
            { status: 500 }
        );
    }
}
