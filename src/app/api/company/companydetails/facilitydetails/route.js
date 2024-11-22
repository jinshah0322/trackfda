import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/db";

  function combineComplianceActionData(warningletters, inspectionCitation, inspectionClassification, importRefusals) {
  const output = [];

  // Process warning letters
  warningletters.forEach(warning => {
    output.push({
      title: 'Warning Letter',
      description: `Subject: ${warning.subject}, Issuing Office: ${warning.issuingoffice}`,
      date: warning.date_to_show,
    });
  });

  // Process inspection citations
  inspectionCitation.forEach(inspection => {
    output.push({
      title: 'Inspection Citation',
      description: `Program Area: ${inspection.program_area}, Short Description: ${inspection.short_description}`,
      date: inspection.date_to_show,
    });
  });

  // Process inspection classifications
  inspectionClassification.forEach(inspection => {
    output.push({
      title: 'Inspection Classification',
      description: `Product Type: ${inspection.product_type}, Classification: ${inspection.classification}`,
      date: inspection.date_to_show,
    });
  });

  // Process import refusals
  importRefusals.forEach(refusal => {
    output.push({
      title: 'Import Refusal',
      description: `Product Code Description: ${refusal.product_code_description}, Import Division: ${refusal.import_division}`,
      date: refusal.date_to_show,
    });
  });

  // Sort by date (descending)
  return output.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function parseActNumber(actNumbers) {
  return actNumbers
    .map(item => {
      const match = item.act_cfr_number.match(/^(\d+)\.(\d+)(?:\((\w+)\))?/);
      return match ? { part_number: match[1], subsection_number: match[2] } : null;
    })
    .filter(item => item && item.subsection_number && item.part_number);
}

async function fetchSubSystemData(conditions) {
  const { rows: subSystem } = await query(
    `SELECT subpartname, sectionname FROM cfrdetails WHERE (subsectionnumber, partnumber) IN (${conditions})`
  );

  return {
    subSystemSubpartData: subSystem.reduce((acc, item) => {
      const subpart = acc.find(entry => entry.subpartname === item.subpartname);
      subpart ? subpart.count++ : acc.push({ subpartname: item.subpartname, count: 1 });
      return acc;
    }, []),
    subSystemSectionData: subSystem.reduce((acc, item) => {
      const section = acc.find(entry => entry.sectionname === item.sectionname);
      section ? section.count++ : acc.push({ sectionname: item.sectionname, count: 1 });
      return acc;
    }, [])
  };
}

export async function GET(req) {
  const url = new URL(req.url);
  const fei_number = url.searchParams.get("fei_number");

  try {
    // Run queries in parallel
    const [
      { rows: facilityDetails },
      { rows: inspectionResult },
      { rows: published483Result },
      { rows: complianceActionsCount },
      { rows: importRefusals },
      { rows: inspectionCitation },
      { rows: inspectionClassification },
      { rows: warningletters },
      { rows: actNumber }
    ] = await Promise.all([
      query(
        `SELECT cd.legal_name, cd.fei_number, cd.firm_profile, cd.firm_address
         FROM company_details cd
         WHERE cd.fei_number = $1`,
        [fei_number]
      ),
      query(
        `SELECT cd.legal_name, cd.fei_number, i.project_area, i.product_type, i.classification,
                i.posted_citations, i.fiscal_year, i.inspection_end_date
         FROM company_details cd
         INNER JOIN inspection_details i ON cd.fei_number = i.fei_number
         WHERE cd.fei_number = $1`,
        [fei_number]
      ),
      query(
        `SELECT cd.legal_name, cd.fei_number, p.record_date, p.download_link, p.inspection_start_date,p.inspection_end_date,
        CASE 
              WHEN inspection_start_date = '' OR inspection_end_date = '' THEN 'NA'
              ELSE CONCAT(
                  (TO_DATE(inspection_end_date, 'DD/MM/YYYY') - TO_DATE(inspection_start_date, 'DD/MM/YYYY')), ' days'
              )
          END AS inspection_duration
         FROM company_details cd
         INNER JOIN published_483s p ON cd.fei_number = p.fei_number
         WHERE cd.fei_number = $1`,
        [fei_number]
      ),
      query(
        `SELECT * FROM compliance_actions ca
         WHERE ca.fei_number = $1`,
        [fei_number]
      ),
      query(
        `SELECT ir.product_code_description, ir.import_division, ir.refused_date AS date_to_show
         FROM import_refusals ir
         WHERE ir.fei_number = $1`,
        [fei_number]
      ),
      query(
        `SELECT ic.program_area, ic.short_description, ic.inspection_end_date AS date_to_show
         FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY fei_number, inspection_end_date ORDER BY inspection_end_date DESC) AS rn
               FROM inspections_citations_details) ic
         WHERE ic.fei_number = $1 AND rn = 1
         ORDER BY ic.inspection_end_date DESC`,
        [fei_number]
      ),
      query(
        `SELECT id.product_type, id.classification, id.inspection_end_date AS date_to_show
         FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY fei_number, inspection_end_date ORDER BY inspection_end_date DESC) AS rn
               FROM inspection_details) id
         WHERE id.fei_number = $1 AND rn = 1
         ORDER BY id.inspection_end_date DESC`,
        [fei_number]
      ),
      query(
        `SELECT wld.subject, wld.issuingoffice, ca.action_taken_date AS date_to_show
         FROM compliance_actions ca
         LEFT JOIN warninglettersdetails wld ON ca.case_injunction_id = wld.marcscmsno
         WHERE ca.fei_number = $1 AND wld.issuingoffice IS NOT NULL`,
        [fei_number]
      ),
      query(
        `SELECT act_cfr_number
         FROM inspections_citations_details icd
         WHERE icd.fei_number = $1`,
        [fei_number]
      )
    ]);

    // Process compliance actions timeline
    const timeLine = combineComplianceActionData(warningletters, inspectionCitation, inspectionClassification, importRefusals);

    // Parse and fetch subsystem data if act numbers exist
    const segmentedData = parseActNumber(actNumber);
    let subSystemSubpartData = [], subSystemSectionData = [];
    if (segmentedData.length) {
      const conditions = segmentedData.map(item => `(${item.subsection_number}, ${item.part_number})`).join(", ");
      ({ subSystemSubpartData, subSystemSectionData } = await fetchSubSystemData(conditions));
    }

    // Return the combined response
    return NextResponse.json({
      facilityDetails,
      inspectionResult,
      published483Result,
      complianceActionsCount,
      importRefusals,
      subSystemSubpartData,
      subSystemSectionData,
      timeLine
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to load data: " + error.message }, { status: 500 });
  }
}
