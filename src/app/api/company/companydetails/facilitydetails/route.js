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
    return NextResponse.json({ facilityDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
