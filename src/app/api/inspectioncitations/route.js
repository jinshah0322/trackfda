import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req) {
  try {
    const { rows: inspectincitations } = await query(
      `select cd.legal_name,cd.firm_address,cd.fei_number,icd.inspection_end_date,icd.act_cfr_number,
      icd.short_description,icd.long_description from company_details cd 
      RIGHT JOIN inspections_citations_details icd on cd.fei_number=icd.fei_number`
    );
    return NextResponse.json({ inspectincitations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
