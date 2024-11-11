"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import Limit from "@/components/limit";

export default function Page() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orangebook/products?page=${page}&limit=${limit}`
      );
      const result = await res.json();
      setData(result.products);
      setTotalCount(result.total_count);
      setIsLoading(false);
    };
    fetchData();
  }, [page, limit]);

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Orange Book Products</h1>
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
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Mkt. Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Active Ingredient</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Proprietary Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Appl. No.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Dosage Form</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Route</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Strength</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>TE Code</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>RLD</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>RS</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Applicant Holder</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.type}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.ingredient}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.trade_name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.appl_no}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.dosage_form}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.route}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.strength}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.te_code}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.rld}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.rs}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.applicant_full_name}</td>
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
