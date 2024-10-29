import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination";
import Link from "next/link";
import '@/app/style.css'

export default function FacilitiesTab({ data }) {
  const [limit, setLimit] = useState(5);
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
          <h2>No facilities available for this company.</h2>
        </div>
      ) : (
        <>
          <Limit limit={limit} onLimitChange={handleLimitChange} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Facility Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Fei Number
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  City
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  State
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Country
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Number Of 483s
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Number Of Warning Letters
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.legal_name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Link className="linkDecoration" href={`/company/${item.legal_name}/facility/${item.fei_number}`}>{item.fei_number}</Link>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.city || "N/A"} {/* Default value for null */}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.state || "N/A"} {/* Default value for null */}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.country_area || "N/A"} {/* Default value for null */}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.form483_count}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.warning_letter_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange}/>
        </>
      )}
    </div>
  );
}
