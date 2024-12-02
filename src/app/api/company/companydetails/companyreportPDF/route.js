export const dynamic = "force-dynamic";

import React from "react";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { query } from "../../../../../../lib/db";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Helper function to truncate long text
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text || "N/A"; // Handle null or undefined values
};
// Table component for PDF
const Table = ({ title, columns, data, styles }) => (
  <View style={[styles.tableContainer]} wrap={false}>
    {/* Table Title */}
    <Text style={styles.tableTitle}>{title}</Text>

    {/* Table Header */}
    <View style={styles.tableRow}>
      {columns.map((col, index) => (
        <Text key={index} style={[styles.tableCellHeader, col.style]}>
          {col.label}
        </Text>
      ))}
    </View>

    {/* Table Body */}
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {columns.map((col, colIndex) => (
          <Text
            key={colIndex}
            style={[styles.tableCell, col.style]}
            numberOfLines={1}
          >
            {truncateText(row[col.key], col.maxLength || 100)}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

// Estimate height for tables (rows + headers)
const estimateTableHeight = (rowCount, rowHeight, headerHeight) => {
  return rowCount * rowHeight + headerHeight;
};

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const encodedCompanyName = url.searchParams.get("companyname");
    const companyname = decodeURIComponent(encodedCompanyName);

    // Fetch data
    const { rows: warningLetterResult } = await query(
      `
        SELECT cd.legal_name, cd.fei_number, cd.firm_address, wl.letterissuedate, wl.issuingoffice, wl.subject, 
        wl.warningletterurl FROM company_details cd
        INNER JOIN warninglettersdetails wl ON cd.fei_number = wl.fei_number
        WHERE cd.legal_name = $1
      `,
      [companyname]
    );

    const { rows: published483Result } = await query(
      `
        SELECT cd.legal_name, cd.firm_address, cd.fei_number, p.record_date, p.download_link, p.inspection_start_date, p.inspection_end_date,
          CASE 
              WHEN inspection_start_date = '' OR inspection_end_date = '' THEN 'N/A'
              ELSE CONCAT(
                  (TO_DATE(inspection_end_date, 'DD/MM/YYYY') - TO_DATE(inspection_start_date, 'DD/MM/YYYY')), ' days'
              )
          END AS inspection_duration
        FROM company_details cd
        INNER JOIN published_483s p ON cd.fei_number = p.fei_number
        WHERE cd.legal_name = $1
      `,
      [companyname]
    );

    const { rows: companyDetailsResult } = await query(
      `
        SELECT fei_number, city, state, country_area, firm_address FROM company_details WHERE legal_name = $1
      `,
      [companyname]
    );

    // Table columns
    const warningLetterColumn = [
      { label: "Issue Date", key: "letterissuedate", style: { flex: 1 } },
      { label: "Company Address", key: "firm_address", style: { flex: 3 }, maxLength: 50 },
      { label: "FEI Number", key: "fei_number", style: { flex: 1 } },
      { label: "Issuing Office", key: "issuingoffice", style: { flex: 2 } },
      { label: "Subject", key: "subject", style: { flex: 2 }, maxLength: 30 },
      { label: "Warning Letter URL", key: "warningletterurl", style: { flex: 3 }, maxLength: 50 },
    ];

    const form483Column = [
      { label: "FEI Number", key: "fei_number", style: { flex: 1 } },
      { label: "Record Date", key: "record_date", style: { flex: 1 } },
      { label: "Company Address", key: "firm_address", style: { flex: 3 }, maxLength: 50 },
      { label: "Inspection Start Date", key: "inspection_start_date", style: { flex: 1 } },
      { label: "Inspection End Date", key: "inspection_end_date", style: { flex: 1 } },
      { label: "483s URL", key: "download_link", style: { flex: 3 }, maxLength: 50 },
      { label: "Inspection Duration", key: "inspection_duration", style: { flex: 1 } },
    ];

    const facilityColumn = [
      { label: "FEI Number", key: "fei_number", style: { flex: 1 } },
      { label: "City", key: "city", style: { flex: 1 } },
      { label: "State", key: "state", style: { flex: 1 } },
      { label: "Country", key: "country_area", style: { flex: 1 } },
      { label: "Company Address", key: "firm_address", style: { flex: 3 }, maxLength: 50 },
    ];

    // PDF styles
    const styles = StyleSheet.create({
      page: {
        padding: 20,
      },
      header: {
        backgroundColor: "#1976D2",
        color: "white",
        padding: 10,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
      },
      tableContainer: {
        marginBottom: 20,
        padding: 5,
      },
      tableTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        color: "black",
        textAlign: "center",
      },
      tableRow: {
        flexDirection: "row",
      },
      tableCellHeader: {
        backgroundColor: "#1976D2",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 10,
        padding: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
      },
      tableCell: {
        textAlign: "center",
        fontSize: 9,
        padding: 4,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        wordWrap: "break-word",
        flexShrink: 1,
      },
    });

    // Estimate heights for all tables
    const warningLetterHeight = estimateTableHeight(
      warningLetterResult.length,
      12,
      20
    );
    const form483Height = estimateTableHeight(
      published483Result.length,
      12,
      20
    );
    const facilityHeight = estimateTableHeight(
      companyDetailsResult.length,
      12,
      20
    );

    const totalHeight = warningLetterHeight + form483Height + facilityHeight;

    const CompanyReportPDF = () => (
      <Document>
        {totalHeight <= 750 ? (
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text>Company Report</Text>
            </View>
            <Table
              title="Warning Letters"
              columns={warningLetterColumn}
              data={warningLetterResult}
              styles={styles}
            />
            <Table
              title="Form 483 Observations"
              columns={form483Column}
              data={published483Result}
              styles={styles}
            />
            <Table
              title="Facility Information"
              columns={facilityColumn}
              data={companyDetailsResult}
              styles={styles}
            />
          </Page>
        ) : (
          <>
            <Page size="A4" style={styles.page}>
              <View style={styles.header}>
                <Text>Company Report</Text>
              </View>
              <Table
                title="Warning Letters"
                columns={warningLetterColumn}
                data={warningLetterResult}
                styles={styles}
              />
              <Table
                title="Form 483 Observations"
                columns={form483Column}
                data={published483Result}
                styles={styles}
              />
            </Page>
            <Page size="A4" style={styles.page}>
              <View style={styles.header}>
                <Text>Company Report - Facility Information</Text>
              </View>
              <Table
                title="Facility Information"
                columns={facilityColumn}
                data={companyDetailsResult}
                styles={styles}
              />
            </Page>
          </>
        )}
      </Document>
    );

    // Generate the PDF stream
    const pdfStream = await renderToStream(<CompanyReportPDF />);

    // Set headers for PDF response
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", 'attachment; filename="company_report.pdf"');

    return new Response(pdfStream, { headers });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF: " + error.message },
      { status: 500 }
    );
  }
}
