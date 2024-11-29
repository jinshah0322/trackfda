import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function GET(req) {
  try {
    const { rows } = await query(
      `SELECT fei_number,firm_legal_name,firm_address,product_code_description,refused_date,import_division,
        fda_sample_analysis,private_lab_analysis,refusal_charges 
        FROM import_refusals ORDER BY refused_date DESC`
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
