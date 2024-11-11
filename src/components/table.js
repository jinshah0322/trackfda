import React from "react";

export default function Table({ data =[], columns =[], tableName="" }) {
  return (
    <div>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No data available for {tableName}.</h2>
        </div>
      ) : (
        <>
          <h2>{tableName} Data Table{}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {column.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {row[column.field] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
