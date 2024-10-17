// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const {rows} = await query("SELECT DISTINCT co.legal_name AS Company, COUNT(wl.id) AS WarningLettersIssued FROM (SELECT legal_name FROM inspection_details WHERE product_type = 'Drugs' UNION SELECT legal_name FROM compliance_actions WHERE product_type = 'Drugs' UNION SELECT legal_name FROM inspection_details WHERE product_type = 'Drugs' UNION SELECT companyname AS legal_name FROM warningletters) AS co LEFT JOIN warningletters wl ON co.legal_name = wl.companyname GROUP BY co.legal_name");
    return NextResponse.json(rows,{status: 200});
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse({error:'Failed to load data'},{status:500});
  }
}