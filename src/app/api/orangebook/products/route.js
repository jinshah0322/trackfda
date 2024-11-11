import { NextResponse } from "next/server";
import { query } from "../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const ingredient = url.searchParams.get("ingredient");
    const tradename = url.searchParams.get("tradename");
    const applicant = url.searchParams.get("applicant");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    let sqlQuery = `SELECT * FROM ob_product WHERE type != 'DISCN'`;
    let count = `SELECT COUNT(*) FROM ob_product WHERE type != 'DISCN'`
    const params = [];

    if (ingredient) {
      sqlQuery += ` AND ingredient = $${params.length + 1}`;
      params.push(ingredient);
    }
    if (tradename) {
      sqlQuery += ` AND trade_name = $${params.length + 1}`;
      params.push(tradename);
    }
    if (applicant) {
      sqlQuery += ` AND applicant = $${params.length + 1}`;
      params.push(applicant);
    }

    // Pagination logic
    const offset = (page - 1) * limit;
    sqlQuery += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows: ob_products } = await query(sqlQuery, params);
    const {rows:totl_count} = await query(count)
    return NextResponse.json({ products: ob_products ,total_count:totl_count[0].count}, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
