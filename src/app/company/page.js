"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Search from "@/components/search";
import Limit from "@/components/limit";
import Pagination from "@/components/pagination";
import Link from "next/link";

async function getCompanies(page, limit, searchTerm = "") {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/company?page=${page}&limit=${limit}&search=${searchTerm}`
  );
  return await response.json();
}

export default function Page() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getCompanies(page, limit, searchTerm);
      setData(result.data);
      setTotalCount(result.totalCount);
      setIsLoading(false);
    };
    fetchData();
  }, [page, limit, searchTerm]);

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Company List</h1>

      <Search
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setPage(1);
        }}
        placeholder=" Search by company..."
      />

      <Limit
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Company
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Number of facility
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Warning letters Issued
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link
                  href={`/company/${item.legal_name}`}
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  {item.legal_name}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.fei_number_count}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.warning_letter_count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={totalPages == 0 ? 0 : page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
