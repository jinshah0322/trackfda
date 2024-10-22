import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyname = url.searchParams.get('compnayname');

    // Get all the distinct FEI numbers based on the legal name
    const { rows: feiNumbers } = await query(`
            SELECT fei_number FROM company_details WHERE legal_name = $1
        `, [companyname]);



    // Check if we received any fei_numbers
    if (feiNumbers.length === 0) {
      return NextResponse.json({ error: 'No FEI numbers found for this company name.' }, { status: 404 });
    }

    // Extract the FEI numbers into an array
    const feiNumbersArray = feiNumbers.map(obj => obj.fei_number);

    // Create placeholders for the SQL query
    const placeholders = feiNumbersArray.map((_, index) => `$${index + 1}`).join(', ');

    // Fetch details from inspection_details using the FEI numbers
    const { rows:companyDetails } = await query(`
            SELECT * FROM company_details WHERE fei_number IN (${placeholders})
        `, feiNumbersArray);
    console.log(companyDetails);
    
    const { rows: form483Details} = await query(`
            SELECT fei_number,date_posted,download_link   FROM published_483s WHERE fei_number IN (${placeholders})
        `, feiNumbersArray)

      console.log(form483Details)  

      const from483CountByFieNumber = form483Details.reduce((acc, item) => {
        const { fei_number } = item;
        
        if (acc[fei_number]) {
          acc[fei_number] += 1;
        } else {
          acc[fei_number] = 1;
        }
        
        return acc;
      }, {});
      
      //Fetch details from warninglettersdetails using the FEI numbers
      const {rows:warningLetters} = await query(`
        SELECT wl.letterissuedate,wl.issuingoffice,wl.subject,wl.warningletterurl
        FROM compliance_actions ca
        JOIN warninglettersdetails wl
        ON ca.case_injunction_id = wl.marcscmsno
        WHERE ca.fei_number in (${placeholders})
    `,feiNumbersArray)
    console.log(warningLetters);
     
    // Return the details from inspection_details
    return NextResponse.json({ data: companyDetails }, { status: 200 });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}