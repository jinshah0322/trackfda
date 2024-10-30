import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const fei_number = url.searchParams.get("fei_number");
    const { rows: facilityDetails } = await query(
      `SELECT legal_name,fei_number,firm_profile,firm_address from company_details where fei_number=$1`,
      [fei_number]
    );

    const { rows: inspectionResult } = await query(
      `
        SELECT cd.legal_name,cd.fei_number,i.project_area,i.product_type,i.classification,
        i.posted_citations,i.fiscal_year,i.inspection_end_date FROM company_details cd
        INNER JOIN inspection_details i ON cd.fei_number = i.fei_number
        WHERE cd.fei_number = $1
      `,
      [fei_number]
    );
    return NextResponse.json({ facilityDetails,inspectionResult }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}