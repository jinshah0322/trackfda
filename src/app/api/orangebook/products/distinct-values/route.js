import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/db";

export async function GET(req) {
  try {
    const distinctIngredients = await query('SELECT DISTINCT(ingredient) FROM ob_product order by ingredient');
    const distinctTradenames = await query('SELECT DISTINCT(trade_name) FROM ob_product order by trade_name');
    const distinctApplicants = await query('SELECT DISTINCT(applicant_full_name) FROM ob_product order by applicant_full_name');

    const ingredientList = distinctIngredients.rows.map(row => row.ingredient);
    const tradenameList = distinctTradenames.rows.map(row => row.trade_name);
    const applicantList = distinctApplicants.rows.map(row => row.applicant_full_name);

    return NextResponse.json({ingredientList,tradenameList,applicantList,}, { status: 200 });
  } catch (error) {
    console.error("Error fetching distinct values:", error);
    return NextResponse.json({ error: "Failed to load distinct values" }, { status: 500 });
  }
}
