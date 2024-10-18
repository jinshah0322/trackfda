// components/Limit.js
import { useState } from "react";

export default function Limit({ limit, onLimitChange }) {
  const [inputValue, setInputValue] = useState(limit);

  const handleInputChange = (event) => {
    const value = Math.max(1, Math.min(100, parseInt(event.target.value) || 1)); // Ensure value is between 1 and 100
    setInputValue(value);
  };

  const handleSubmit = () => {
    onLimitChange(inputValue); // Call the parent's onLimitChange function
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="limit">Items per page:</label>
      <input
        id="limit"
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        min={1}
        max={100}
        style={{ marginLeft: '10px', width: '60px' }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Set Limit
      </button>
    </div>
  );
}
