import Link from "next/link";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";

export default function Coinvestigator({
  data,
  onTabChange,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <>
      <Limit limit={limit} onLimitChange={onLimitChange} />
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Co-Investigator Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Number of Investigations Done
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  style={{ color: "blue", textDecoration: "none" }}
                  href={`/investigators/investigator_details?name=${item.co_employee_name}`}
                  onClick={() => onTabChange("overview")}
                >
                  {item.co_employee_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.investigations_done}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={Math.ceil(data.length / limit)}
        onPageChange={onPageChange}
      />
    </>
  );
}
