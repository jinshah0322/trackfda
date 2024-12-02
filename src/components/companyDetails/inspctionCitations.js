import React, { useState } from "react";
import Pagination from "../pagination";
import Limit from "../limit";
import Link from "next/link";

export default function InspectionCitation({ inspectionCitation }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(inspectionCitation.length / limit);
  const paginatedData = inspectionCitation.slice(
    (page - 1) * limit,
    page * limit
  );

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page
  };

  return (
    <div>
      <Limit limit={limit} onLimitChange={handleLimitChange} />
      {inspectionCitation.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No inspection citations available.</h2>
        </div>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th>Firm Address</th>
                <th>FEI Number</th>
                <th>Act/CFR Number</th>
                <th>Short Description</th>
                <th>Long Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.firm_address}</td>
                  <td>
                    <Link
                      href={`/company/${encodeURIComponent(
                        item.legal_name
                      )}/facility/${item.fei_number}`}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                      }}
                    >
                      {item.fei_number}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-C/section-${
                        item.act_cfr_number.includes("(")
                          ? item.act_cfr_number.split("(")[0]
                          : item.act_cfr_number
                      }#p-${item.act_cfr_number}`}
                      target="_blank"
                      style={{ color: "blue", textDecoration: "none" }}
                    >
                      {item.act_cfr_number}
                    </Link>
                  </td>
                  <td>{item.short_description}</td>
                  <td>{item.long_description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            totalRecords={inspectionCitation.length}
          />
        </>
      )}
    </div>
  );
}
