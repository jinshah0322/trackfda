import BarChart from "../countByYearBarChart";
import Link from "next/link";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";

export default function Overview({
  data,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const { last_record_date, num_483s_issued, overview } = data;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = overview.facilityDetails_issueDate.slice(
    startIndex,
    endIndex
  );

  return (
    <>
      <div
        className="cards-container"
        style={{ gap: "10px", justifyContent: "flex-start" }}
      >
        <div className="card">
          <p className="card-title">Last Form 483 Issued Date</p>
          <p className="card-number">{last_record_date}</p>
        </div>
        <div className="card">
          <p className="card-title">Form 483s Issued</p>
          <p className="card-number">{num_483s_issued}</p>
        </div>
      </div>
      <div
        className="chart-container"
        style={{
          marginTop: "20px",
          width: "100%",
          maxWidth: "800px",
          height: "400px",
        }}
      >
        {overview && overview.investigationByYear ? (
          <BarChart data={overview.investigationByYear} />
        ) : (
          <h1>No data available for investigations by year.</h1>
        )}
      </div>
      <Limit limit={limit} onLimitChange={onLimitChange} />
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Facility Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Facility Location
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Issue Dates
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  style={{ color: "blue", textDecoration: "none" }}
                  href={`/company/${item.legal_name}/facility/${item.fei_number}`}
                >
                  {item.legal_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.firm_address}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.record_dates}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={Math.ceil(
          overview.facilityDetails_issueDate.length / limit
        )}
        onPageChange={onPageChange}
      />
    </>
  );
}
