export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const appl_no = url.searchParams.get("applno");
    const appl_type = url.searchParams.get("appltype");
    const {rows} = await query(`select * from ob_product where appl_no=$1 and appl_type=$2 order by product_no`,[appl_no,appl_type])
    return NextResponse.json({productDetails:rows}, { status: 200 })
  } catch (error) {
    console.error("Error fetching Product Details:", error);
    return NextResponse.json({ error: "Failed to load Product Details" }, { status: 500 });
  }
}
