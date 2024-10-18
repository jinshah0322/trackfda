"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Search from "@/components/search"; // Import the Search component
import Limit from "@/components/limit"; // Import the Limit component

async function getUsers(page, limit, searchTerm = "") {
  let response = await fetch(
    `http://localhost:3000/api/company?page=${page}&limit=${limit}&search=${searchTerm}`
  );
  return await response.json();
}

export default function Page() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // State for limit
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getUsers(page, limit, searchTerm); // Include limit in API call
      setData(result.data);
      setTotalCount(result.totalCount);
      setIsLoading(false);
    };
    fetchData();
  }, [page, limit, searchTerm]); // Depend on limit as well

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>User List</h1>

      <Search
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setPage(1);
        }}
      />

      <Limit
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1); // Reset to the first page on limit change
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Company
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Warning Letters Issued
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.company}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.warninglettersissued}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
