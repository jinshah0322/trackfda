import React from "react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  totalRecords,
}) {
  return (
    <div style={{ marginTop: "20px", display: "flex", alignItems: "center"}}>
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        style={{
          padding: "8px 16px",
          marginRight: "10px",
          backgroundColor: page === 1 ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: page === 1 ? "not-allowed" : "pointer",
        }}
      >
        Previous
      </button>
      <span style={{ margin: "0 10px", fontWeight: "bold" }}>
        Page {page} of {totalPages} | Total Records: {totalRecords}
      </span>
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        style={{
          padding: "8px 16px",
          marginLeft: "10px",
          backgroundColor: page === totalPages ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: page === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next
      </button>
    </div>
  );
}
