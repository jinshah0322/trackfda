import React from "react";

export default function Table({ data = [], columns = [], tableName = "" }) {
  // Ensure `data` is an array and not null
  if (!Array.isArray(data)) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <h2>No data available for {tableName}.</h2>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <h2>No columns available for {tableName}.</h2>
      </div>
    );
  }

  return (
    <div>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No data available for {tableName}.</h2>
        </div>
      ) : (
        <>
          <h2>{tableName} Data Table</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row[column.field] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
