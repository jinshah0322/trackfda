export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query } from "../../../../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const appl_no = url.searchParams.get("applno");
    const appl_type = url.searchParams.get("appltype");
    const product_no = url.searchParams.get("productno");
    const {rows:patentDetails} = await query(`select * from ob_patent where appl_no=$1 and appl_type=$2 and product_no=$3 order by product_no`,[appl_no,appl_type,product_no])
    const {rows:exclusivityDetails} = await query(`select * from ob_exclusivity where appl_no=$1 and appl_type=$2 and product_no=$3 order by product_no`,[appl_no,appl_type,product_no])
    return NextResponse.json({patentDetails,exclusivityDetails}, { status: 200 })
  } catch (error) {
    console.error("Error fetching Product Details:", error);
    return NextResponse.json({ error: "Failed to load Product Details" }, { status: 500 });
  }
}
