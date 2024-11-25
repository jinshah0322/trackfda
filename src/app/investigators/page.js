"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Search from "@/components/search";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/investigators?search=${searchTerm}`
      );
      response = await response.json();
      setData(response.investigatorsData);
      setIsLoading(false);
    };
    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    // Calculate total count based on search results and apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    setFilteredData(data.slice(start, end));
    setTotalCount(data.length);
  }, [data, page, limit]);

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Investigator List</h1>

      <Search
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setPage(1); // Reset to page 1 on new search
        }}
        placeholder="Search by Investigator..."
      />

      <Limit
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1); // Reset to page 1 on limit change
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Investigator Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Number of 483s Issued
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Number of Warning Letters issued
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Conversion Rate
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Last 483 Issued Date
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  href={`/investigators/investigator_details?name=${item.investigator}`}
                  style={{
                    color: "blue",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {item.investigator}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.num_483s_issued}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.warning_letter_count}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {Number((item.warning_letter_count*100)/item.num_483s_issued).toFixed(1)}%
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.latest_record_date || "No Date Available"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={totalPages === 0 ? 0 : page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
