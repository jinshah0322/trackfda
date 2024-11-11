import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = parseInt(url.searchParams.get('limit'), 10) || 10;
    const search = url.searchParams.get('search') || "";

    const offset = (page - 1) * limit;

    // Use COUNT(*) OVER() for total count along with paginated results
    const { rows } = await query(`
      SELECT cd.legal_name, 
             COUNT(DISTINCT cd.fei_number) AS fei_number_count, 
             COUNT(wld.marcscmsno) AS warning_letter_count,
             COUNT(*) OVER() AS total_count
      FROM company_details cd
      LEFT JOIN compliance_actions ca ON cd.fei_number = ca.fei_number
      LEFT JOIN warninglettersdetails wld ON ca.case_injunction_id = wld.marcscmsno
      WHERE LOWER(cd.legal_name) LIKE LOWER($1)
      GROUP BY cd.legal_name
      ORDER BY cd.legal_name
      LIMIT $2 OFFSET $3
    `, [`%${search}%`, limit, offset]);

    const totalCount = rows.length > 0 ? rows[0].total_count : 0;

    return NextResponse.json({ data: rows, totalCount, page, limit }, { status: 200 });
  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json({ error: 'Failed to load company data' }, { status: 500 });
  }
}
