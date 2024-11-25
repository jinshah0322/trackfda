import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";
import Link from "next/link";

export default function WarningLettersTab({ data }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / limit);
  const paginatedData = data.slice((page - 1) * limit, page * limit);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {paginatedData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Warning letter available for this company.</h2>
        </div>
      ) : (
        <>
          <Limit limit={limit} onLimitChange={handleLimitChange} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Issue Date
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Company Address
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  FEI Number
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Issuing Office
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Subject
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.letterissuedate}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.firm_address}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <Link className="linkDecoration" href={`/company/${item.legal_name}/facility/${item.fei_number}`}>{item.fei_number}</Link>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.issuingoffice}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.subject}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(item.warningletterurl, "_blank")
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
