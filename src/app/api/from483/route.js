import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";



export const GET =async(req)=>{
    try {

        const { rows } = await query(`
          SELECT record_date,legal_name from  published_483s  order by record_date desc
        ` );
    
        
    
        return NextResponse.json({ data: rows }, { status: 200 });
      } catch (error) {
        console.error('Error fetching company data:', error);
        return NextResponse.json({ error: 'Failed to load company data' }, { status: 500 });
      }
}