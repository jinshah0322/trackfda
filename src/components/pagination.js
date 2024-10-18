import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span style={{ margin: "0 10px" }}>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
