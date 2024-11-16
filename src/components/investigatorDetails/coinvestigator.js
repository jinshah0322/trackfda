import Link from "next/link";

export default function Coinvestigator({ data, onTabChange }) {
  console.log(data);

  return (
    <>
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
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  style={{ color: "blue", textDecoration: "none" }}
                  href={`/investigators/investigator_details?name=${item.co_investigator_name}`}
                  onClick={() => onTabChange("overview")}
                >
                  {item.co_investigator_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.investigations_done}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
