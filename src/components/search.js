// components/Search.js
import { useState } from "react";

export default function Search({ searchTerm, onSearch }) {
  const [inputValue, setInputValue] = useState(searchTerm || "");

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search by company..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Update local input state
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button type="submit" style={{ padding: '8px' }}>
        Search
      </button>
    </form>
  );
}
