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
  
  const form483Query = `
    SELECT 
        cd.legal_name,
        COALESCE(COUNT(fp.date_posted), 0) AS total_form483,
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
  
  const investigatorsQuery = `
    SELECT 
        legal_name, investigators, record_date
    FROM 
        published_483s
    WHERE 
        legal_name IN (${placeholders})
        AND (TO_DATE(record_date, 'DD-MM-YYYY') BETWEEN $${companyNames.length + 1} AND $${companyNames.length + 2} OR record_date IS NULL);
  `;
  
  const warningletterQuery = `
 WITH fei_numbers AS (
    SELECT DISTINCT legal_name, fei_number
    FROM public.published_483s
    WHERE legal_name IN (${placeholders})
      AND (
        TO_DATE(record_date, 'DD-MM-YYYY') BETWEEN $${companyNames.length + 1} AND $${companyNames.length + 2}
        OR record_date IS NULL
      )
),
warning_letter_count AS (
    SELECT 
        f.legal_name,
        COUNT(w.fei_number) AS total_warning_letters,
        COALESCE(MAX(w.letterissuedate), NULL) AS latest_warning_letter_date
    FROM 
        fei_numbers f
    LEFT JOIN 
        public.warninglettersdetails w
    ON 
        f.fei_number = w.fei_number
    GROUP BY 
        f.legal_name
)
SELECT 
    legal_name,
    COALESCE(total_warning_letters, 0) AS warning_letter_count,
    latest_warning_letter_date
FROM 
    warning_letter_count;

  `;
  
  
   function processInvestigators(data, companyNames) {
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
          investigatorCounts: {},
        };
      }
  
      // For each investigator, increment their count
      investigatorsList.forEach((investigator) => {
        if (!investigator) return; // Skip falsy values
        if (!groupedData[legal_name].investigatorCounts[investigator]) {
          groupedData[legal_name].investigatorCounts[investigator] = 1;
        } else {
          groupedData[legal_name].investigatorCounts[investigator] += 1;
        }
      });
    });
  
    // Ensure all companies are included
    companyNames.forEach((companyName) => {
      if (!groupedData[companyName]) {
        groupedData[companyName] = {
          legal_name: companyName,
          investigatorCounts: {},
        };
      }
    });
  
    // Process each company's investigators
    const result = Object.values(groupedData).map((company) => {
      const { legal_name, investigatorCounts } = company;
  
      // Total number of unique investigators
      const totalInvestigators = Object.keys(investigatorCounts).length;
  
      let investigatorsString = 'No inspector found';
  
      if (totalInvestigators > 0) {
        // Create an array of investigators with counts
        const investigatorsWithCounts = Object.entries(investigatorCounts);
  
        // Sort investigators by counts in descending order, then by name
        investigatorsWithCounts.sort((a, b) => {
          if (b[1] !== a[1]) {
            return b[1] - a[1]; // Descending order by count
          } else {
            return a[0].localeCompare(b[0]); // Ascending order by name
          }
        });
  
        // Limit to top N investigators (change TOP_N as needed)
        const TOP_N = 5;
        const topInvestigators = investigatorsWithCounts.slice(0, TOP_N);
  
        // Join top investigators into a string
        investigatorsString = topInvestigators.map(([name]) => name).join(', ');
      }
  
      return {
        legal_name,
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
    const { rows :form483s} = await query(form483Query, values);
    const form483sMetric = form483s.map(item => ({
        legal_name: item.legal_name,
        "Total form483s Issued": item.total_form483,
        "Last form483 issued": item.last_date_posted
        ? new Date(item.last_date_posted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : ''
      }));
    const { rows :investigators} = await query(investigatorsQuery, values);
    const { rows: warningletters }= await query(warningletterQuery,values);
    const parseDate = (dateStr) => {
      if (!dateStr) return null; // Handle null or undefined dates
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JS
    };
    const warninglettersMetric = warningletters.map((item) => ({
      legal_name: item.legal_name,
      "Total Warning Letters": item.warning_letter_count ?? 0, // Default to 0 if undefined
      "Last Warning Letter Date": item.latest_warning_letter_date
      ? parseDate(item.latest_warning_letter_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A", // Handle null or undefined
    }));    
    const investigatorsMetric= processInvestigators(investigators,companyNames);
    return NextResponse.json({inspectionMetric,form483sMetric,investigatorsMetric,warninglettersMetric},{status:200});
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
