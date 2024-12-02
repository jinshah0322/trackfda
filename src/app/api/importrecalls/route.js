import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req) {
  try {
    const { rows } = await query(
      `SELECT ir.*,cd.firm_address FROM import_recalls ir 
        LEFT JOIN company_details cd ON ir.fei_number=cd.fei_number
        ORDER BY center_classification_date DESC`
    );
    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data: " + error.message },
      { status: 500 }
    );
  }
}
