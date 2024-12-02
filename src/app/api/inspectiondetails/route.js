import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req) {
  try {
    const { rows: inspectiondetails } = await query(
      `
          SELECT cd.legal_name,cd.firm_address,cd.fei_number,i.project_area,i.product_type,i.classification,
          i.posted_citations,i.fiscal_year,i.inspection_end_date,i.inspection_id FROM company_details cd
          RIGHT JOIN inspection_details i ON cd.fei_number = i.fei_number
        `
    );
    return NextResponse.json({ inspectiondetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
