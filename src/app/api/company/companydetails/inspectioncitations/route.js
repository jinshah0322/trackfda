import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyname = url.searchParams.get("companyname");
    const fei_number = url.searchParams.get("inspectioncitation");
    const { rows: inspectionCitationsResult } = await query(
      `SELECT cd.legal_name,cd.fei_number,icd.act_cfr_number,icd.short_description,icd.long_description 
        FROM company_details cd
        INNER JOIN inspections_citations_details icd on cd.fei_number=icd.fei_number
        WHERE cd.legal_name = $1 and icd.fei_number=$2`,
      [companyname, fei_number]
    );
    return NextResponse.json({ inspectionCitationsResult }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
