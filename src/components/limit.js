import { useState } from "react";

export default function Limit({ limit, onLimitChange }) {
  const [selectedLimit, setSelectedLimit] = useState(limit);

  const handleLimitChange = (event) => {
    const value = parseInt(event.target.value);
    setSelectedLimit(value);
    onLimitChange(value); // Call the parent's onLimitChange function
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="limit">Items per page:</label>
      <select
        id="limit"
        value={selectedLimit}
        onChange={handleLimitChange}
        style={{ marginLeft: '10px' }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
}
