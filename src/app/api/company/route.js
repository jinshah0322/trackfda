import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    const search = url.searchParams.get('search') || "";

    //Get all the distinct company names
    const { rows } = await query(`
      SELECT cd.legal_name, COUNT(DISTINCT cd.fei_number) AS fei_number_count, COUNT(wld.marcscmsno) AS warning_letter_count 
      FROM company_details cd
      LEFT JOIN compliance_actions ca ON cd.fei_number = ca.fei_number
      LEFT JOIN warninglettersdetails wld ON ca.case_injunction_id = wld.marcscmsno
      WHERE lower(cd.legal_name) like lower($1)
      GROUP BY cd.legal_name
      ORDER BY cd.legal_name
      LIMIT $2 OFFSET $3
    `, [`%${search}%`, limit, offset]);

    // Count total records for pagination with the same search filter
    const { rows: totalRows } = await query(`
      SELECT cd.legal_name, COUNT(DISTINCT cd.fei_number) AS fei_number_count, COUNT(wld.marcscmsno) AS warning_letter_count 
      FROM company_details cd
      LEFT JOIN compliance_actions ca ON cd.fei_number = ca.fei_number
      LEFT JOIN warninglettersdetails wld ON ca.case_injunction_id = wld.marcscmsno
      WHERE lower(cd.legal_name) like lower($1)
      GROUP BY cd.legal_name
      ORDER BY cd.legal_name
    `, [`%${search}%`]);
    
    const totalCount = totalRows.length || 1; // Get total count

    return NextResponse.json({ data: rows, totalCount, page, limit }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}