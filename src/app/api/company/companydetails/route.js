import { NextResponse } from "next/server";
import { query } from "../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyname = url.searchParams.get("compnayname");

    // Fetch distinct FEI numbers and related details in a single query
    const { rows: companyDetailsResult } = await query(
      `
      SELECT * FROM company_details WHERE legal_name = $1
    `,
      [companyname]
    );

    const { rows: published483Result } = await query(
        `
        SELECT cd.legal_name, cd.fei_number, p.date_posted, p.download_link FROM company_details cd
        INNER JOIN published_483s p ON cd.fei_number = p.fei_number
        WHERE cd.legal_name = $1
      `,
        [companyname]
      );

    const { rows: warningLetterResult } = await query(
        `
        SELECT cd.fei_number,cd.legal_name,wl.letterissuedate, wl.issuingoffice, wl.subject, 
        wl.warningletterurl FROM company_details cd
        INNER JOIN compliance_actions ca ON cd.fei_number = ca.fei_number
        INNER JOIN warninglettersdetails wl ON ca.case_injunction_id = wl.marcscmsno
        WHERE cd.legal_name = $1
      `,
        [companyname]
      );

    // Get unique FEI numbers to count total facilities
    const totalFacilities = companyDetailsResult.length;
    const totalWarningLetters = warningLetterResult.length;
    const totalPublished483s = published483Result.length

    // Separate company details, form 483 details, and warning letters
    const facilities = companyDetailsResult.map(
      ({legal_name,fei_number,city,state,country_area,firm_address}) => 
      ({legal_name,fei_number,city,state,country_area,firm_address})
    );
    const form483Details = published483Result.map(
      ({ date_posted, fei_number, legal_name, download_link}) => 
      ({date_posted,fei_number,legal_name,download_link})
    );
    const warningLetters = warningLetterResult.map(
      ({letterissuedate,fei_number,legal_name,issuingoffice,subject,warningletterurl}) => 
      ({letterissuedate,fei_number,legal_name,issuingoffice,subject,warningletterurl})
    );

    // Count published 483s by FEI number
    const form483CountByFieNumber = form483Details.reduce((acc, item) => {
      acc[item.fei_number] = (acc[item.fei_number] || 0) + 1;
      return acc;
    }, {});

    // Count warningLetter by FEI number
    const warningLetterCountByFieNumber = warningLetters.reduce((acc, item) => {
      acc[item.fei_number] = (acc[item.fei_number] || 0) + 1;
      return acc;
    }, {});

    // Return the combined data
    return NextResponse.json(
      {totalFacilities, totalPublished483s, totalWarningLetters, facilities, form483Details, warningLetters},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
