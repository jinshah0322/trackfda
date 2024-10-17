import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get('limit')) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit; // Calculate offset for pagination

    // Modify the query to include LIMIT and OFFSET for pagination
    const { rows } = await query(`
      SELECT DISTINCT co.legal_name AS Company, COUNT(wl.id) AS WarningLettersIssued 
      FROM (
        SELECT legal_name FROM inspection_details WHERE product_type = 'Drugs' 
        UNION 
        SELECT legal_name FROM compliance_actions WHERE product_type = 'Drugs' 
        UNION 
        SELECT legal_name FROM inspection_details WHERE product_type = 'Drugs' 
        UNION 
        SELECT companyname AS legal_name FROM warningletters
      ) AS co 
      LEFT JOIN warningletters wl ON co.legal_name = wl.companyname 
      GROUP BY co.legal_name 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Count total records for pagination
    const { rows: totalRows } = await query(`
      SELECT COUNT(DISTINCT co.legal_name) AS total 
      FROM (
        SELECT legal_name FROM inspection_details WHERE product_type = 'Drugs' 
        UNION 
        SELECT legal_name FROM compliance_actions WHERE product_type = 'Drugs' 
        UNION 
        SELECT legal_name FROM inspection_details WHERE product_type = 'Drugs' 
        UNION 
        SELECT companyname AS legal_name FROM warningletters
      ) AS co
    `);
    const totalCount = totalRows[0]?.total || 0; // Get total count

    return NextResponse.json({ data: rows, totalCount, page, limit }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
