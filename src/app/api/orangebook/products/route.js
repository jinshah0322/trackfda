export const dynamic = "force-dynamic";
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

    const types = url.searchParams.getAll("type");
    const hasTypes = types.length > 0;

    let sqlQuery = `SELECT * FROM ob_product`;
    let countQuery = `SELECT COUNT(*) FROM ob_product`;
    const conditions = [];
    const params = [];

    // Add filters
    if (hasTypes) {
      conditions.push(`type = ANY($${params.length + 1}::text[])`);
      params.push(types);
    } else {
      conditions.push("type != 'DISCN'");
    }

    if (ingredient) {
      conditions.push(`ingredient = $${params.length + 1}`);
      params.push(ingredient);
    }

    if (tradename) {
      conditions.push(`trade_name = $${params.length + 1}`);
      params.push(tradename);
    }

    if (applicant) {
      conditions.push(`applicant_full_name = $${params.length + 1}`);
      params.push(applicant);
    }

    // Combine conditions into SQL
    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ");
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    // Add ORDER BY, LIMIT, OFFSET
    const offset = (page - 1) * limit;
    sqlQuery += ` ORDER BY TO_DATE(approval_date, 'Mon DD, YYYY') DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Execute queries
    const { rows: ob_products } = await query(sqlQuery, params);
    const { rows: total_count } = await query(countQuery, params.slice(0, -2)); // Exclude limit/offset params for count query

    return NextResponse.json(
      { products: ob_products, total_count: parseInt(total_count[0].count, 10) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}