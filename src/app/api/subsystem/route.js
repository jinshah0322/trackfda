import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function POST(req) {
    try {
        const reqData = await req.json();
        const { sectionName, partNumberName, subPartName } = reqData;
        let found483 = [];
        // console.log(subPartName)

        // Initialize SQL query and conditions
        let sqlQuery = `SELECT partnumber, subsectionnumber, subpart, secalphabet FROM cfrdetails`;
        const conditions = [];
        const values = [];

        // Add conditions only if parameters are provided
        if (sectionName) {
            conditions.push(`sectionname = $${conditions.length + 1}`);
            values.push(sectionName);
        }
        if (partNumberName) {
            conditions.push(`partnumbers_name = $${conditions.length + 1}`);
            values.push(partNumberName);
        }
        if (subPartName) {
            conditions.push(`subpartname = $${conditions.length + 1}`);
            values.push(subPartName);
        }

        // Append WHERE clause only if there are conditions
        if (conditions.length > 0) {
            sqlQuery += ` WHERE ` + conditions.join(' AND ');
        }

        // If there are no conditions (i.e., all parameters are empty), return an error response
        if (values.length === 0) {
            return NextResponse.json(
                { message: 'No parameters provided for filtering' },
                { status: 400 }
            );
        }
        // console.log(conditions,values,sqlQuery)
        // Execute the query to fetch the act categories
        const { rows: actCategories } = await query(sqlQuery, values);
        // console.log(actCategories)
        // If no act categories are found, return an empty response
        if (!actCategories || actCategories.length === 0) {
            found483 = {}
            return NextResponse.json({ found483 },
                { message: 'No matching records found for the given filters' },
                { status: 404 }
            );
        }

        // Generate actno from actCategories
        const actno = [...new Set(actCategories.map(item =>
            `${item.partnumber}.${item.subsectionnumber}${item.secalphabet ? `(${item.secalphabet})` : ''}`
        ))];

        // console.log('Query Result:', actno);

        // If no actno values are found, return an empty response
        if (actno.length === 0) {
            found483 = {}
            return NextResponse.json(found483,
                { message: 'No valid act numbers found' },
                { status: 404 }
            );
        }

        // Build conditions for citations query using parameterized queries
        const actConditions = actno.map((act, index) => {
            return `act_cfr_number LIKE $${index + 1}`;
        });

        const citationEndDateQuery = `SELECT inspection_end_date
            FROM inspections_citations_details
            WHERE ${actConditions.join(' OR ')}`;

        // Execute the citation query
        const citationValues = actno; // Pass the actno array as the parameter values
        const { rows: citationEndDate } = await query(citationEndDateQuery, citationValues);

        // console.log('Citation End Dates:', citationEndDate);

        // If citationEndDate is empty, return an empty array for found483
        if (!citationEndDate || citationEndDate.length === 0) {
            found483 = [];
        } else {
            // Build placeholders for the next query
            function generatePlaceholders(arr) {
                return arr.map((_, index) => `$${index + 1}`).join(", ");
            }
            const placeholders = generatePlaceholders(citationEndDate);

            const { rows: found483Data } = await query(
                `SELECT DISTINCT date_posted, legal_name, fei_number, download_link
                FROM published_483s
                WHERE record_date IN (${placeholders})`,
                citationEndDate.map(item => item.inspection_end_date) // Pass the correct date values
            );

            // If no results found for 483s, set found483 to an empty array
            found483 = found483Data.length > 0 ? found483Data : [];
            // console.log('Found 483s:', found483);
        }

        // Return the response based on the found483 data
        return NextResponse.json({ found483 }, { status: 200 });

    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the request' },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const { rows } = await query(
            `SELECT DISTINCT subpartname, partnumbers_name, sectionname FROM cfrdetails`
        );

        // Log raw query results
        // console.log('Raw Query Results:', rows);

        // Extract unique values from each column
        const subPartName = [...new Set(rows.map(row => row.subpartname))];
        const partNumberName = [...new Set(rows.map(row => row.partnumbers_name))];
        const sectionName = [...new Set(rows.map(row => row.sectionname))];

        // Return the formatted data
        return NextResponse.json({ subPartName, partNumberName, sectionName }, { status: 200 });
    } catch (error) {
        console.error('Error handling GET request:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching data' },
            { status: 500 }
        );
    }
}
