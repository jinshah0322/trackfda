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
            AND (fp.date_posted BETWEEN $${companyNames.length + 1} AND $${companyNames.length + 2})
        GROUP BY 
            cd.legal_name;

`;
   const investigatorsQuery=`
     SELECT legal_name,investigators from published_483s where legal_name IN (${placeholders})
     AND (record_date BETWEEN $${companyNames.length+1} AND $${companyNames.length+2})
   `;
   const warningletterQuery =`
   `;

   function processInvestigators(data) {
    // Initialize an empty object to hold the grouped data
    const groupedData = {};
  
    // Iterate over the data
    data.forEach((item) => {
      const { legal_name, investigators } = item;
  
      // Ensure investigators is always an array
      const investigatorsList = Array.isArray(investigators) ? investigators : [];
  
      if (!groupedData[legal_name]) {
        // If the company is not yet in groupedData, add it
        groupedData[legal_name] = {
          legal_name,
          investigators: [...investigatorsList],
        };
      } else {
        // If it is already there, add the investigators to the existing array
        groupedData[legal_name].investigators.push(...investigatorsList);
      }
    });
  
    // Process each company's investigators
    const result = Object.values(groupedData).map((company) => {
      // Remove empty strings or falsy values from investigators array
      let investigators = company.investigators.filter(Boolean);
  
      // Remove duplicate investigators
      investigators = Array.from(new Set(investigators));
  
      // Total number of investigators having inspected at least one facility
      const totalInvestigators = investigators.length;
  
      // Limit to top N investigators (change TOP_N as needed)
      const TOP_N = 5;
      let topInvestigators = investigators;
      if (investigators.length > TOP_N) {
        topInvestigators = investigators.slice(0, TOP_N);
      }
  
      // Join top investigators into a string
      const investigatorsString = topInvestigators.join(', ');
  
      return {
        legal_name: company.legal_name,
        investigators: investigatorsString,
        'Total Investigators having inspected min 1 facility': totalInvestigators,
      };
    });
  
    return result;
  }
  
  
try {
    const { rows :inspection} = await query(inspectionQuery, values);
    const inspectionMetric = inspection.map(item => ({
        legal_name: item.legal_name,
        "Total Inspections": item.total_inspections,
        "No Action Indicated (NAI)": item.nai_count,
        "Voluntary Action Indicated (VAI)": item.vai_count,
        "Official Action Indicated (OAI)": item.oai_count
      }));
    const { rows :from483s} = await query(from483Query, values);
    const from483sMetric = from483s.map(item => ({
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
    const { rows :investigators} = await query(investigatorsQuery, values);
    const investigatorsMetric= processInvestigators(investigators);
    return NextResponse.json({inspectionMetric,from483sMetric,investigatorsMetric},{status:200});
} catch (error) {
    console.error('Error executing query', error);
    throw error;
}
}

export async function GET(req) {
    try {
        // Query the database to get the company names
        const { rows: companyNameList } = await query(
            `SELECT distinct legal_name FROM company_details`
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
