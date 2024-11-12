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
    const expiryInYears = parseInt(url.searchParams.get("expiry_in_years"), 10);

    const types = url.searchParams.getAll("type");
    const hasTypes = types.length > 0;

    let sqlQuery = `
        SELECT ob_patent.*, ob_product.type, ob_product.ingredient, ob_product.trade_name,
        ob_product.applicant_full_name FROM ob_patent
        JOIN ob_product
        ON ob_patent.appl_no = ob_product.appl_no
        AND ob_patent.product_no = ob_product.product_no 
    `;
    let countQuery = `
        SELECT count(*) FROM ob_patent
        JOIN ob_product
        ON ob_patent.appl_no = ob_product.appl_no
        AND ob_patent.product_no = ob_product.product_no 
    `;

    const conditions = [];
    const params = [];

    // Handle types filter
    if (hasTypes) {
      conditions.push(`ob_product.type = ANY($${params.length + 1}::text[])`);
      params.push(types);
    } else {
      conditions.push("ob_product.type != 'DISCN'");
    }

    // Add ingredient filter
    if (ingredient) {
      conditions.push(`ob_product.ingredient = $${params.length + 1}`);
      params.push(ingredient);
    }

    // Add tradename filter
    if (tradename) {
      conditions.push(`ob_product.trade_name = $${params.length + 1}`);
      params.push(tradename);
    }

    // Add applicant filter
    if (applicant) {
      conditions.push(`ob_product.applicant_full_name = $${params.length + 1}`);
      params.push(applicant);
    }

    // Add expiry date range filter
    if (expiryInYears) {
      const currentDate = new Date().toISOString().split("T")[0];
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + expiryInYears);
      const expiryDateString = expiryDate.toISOString().split("T")[0];
      console.log(expiryDateString);
      conditions.push(
        `ob_patent.patent_expire_date BETWEEN $${params.length + 1} AND $${
          params.length + 2
        }`
      );
      params.push(currentDate, expiryDateString);
    }

    // Construct final query with WHERE clause if conditions exist
    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ");
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    // Add pagination
    const offset = (page - 1) * limit;
    sqlQuery += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Execute the queries
    const { rows: ob_patents } = await query(sqlQuery, params);
    const { rows: total_count } = await query(countQuery, params.slice(0, -2));

    return NextResponse.json(
      { patents: ob_patents, total_count: parseInt(total_count[0].count, 10) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}