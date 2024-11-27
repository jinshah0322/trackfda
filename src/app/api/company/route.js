export const dynamic = "force-dynamic";
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
        SELECT cd.legal_name, COUNT(DISTINCT cd.fei_number) AS fei_number_count, COUNT(DISTINCT wld.marcscmsno) AS warning_letter_count,
        COUNT(DISTINCT p483.published_483s_id) AS published_483_count,COUNT(DISTINCT ins.inspection_details_id) AS inspection_details_count,
        COUNT(DISTINCT icd.inspections_citations_details_id) as inspections_citations_count,COUNT(*) OVER() AS total_count
        FROM company_details cd
        LEFT JOIN warninglettersdetails wld ON cd.fei_number = wld.fei_number
        LEFT JOIN published_483s p483 ON cd.fei_number = p483.fei_number
        LEFT JOIN inspection_details ins ON cd.fei_number = ins.fei_number
        LEFT JOIN inspections_citations_details icd ON cd.fei_number = icd.fei_number
        WHERE LOWER(cd.legal_name) LIKE LOWER($1)
        GROUP BY cd.legal_name
        ORDER BY published_483_count DESC
        LIMIT $2 OFFSET $3;
    `, [`%${search}%`, limit, offset]);

    const totalCount = rows.length > 0 ? rows[0].total_count : 0;

    return NextResponse.json({ data: rows, totalCount, page, limit }, { status: 200 });
  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json({ error: 'Failed to load company data' }, { status: 500 });
  }
}
  