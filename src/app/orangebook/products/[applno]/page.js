"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";

export default function Page({ params, searchParams }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProductNo, setExpandedProductNo] = useState(null); // Track which card is expanded

  const defaultProductNo = searchParams.productno; // Use product number from searchParams

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true before fetching data
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orangebook/products/productdetails?applno=${params.applno}&appltype=${searchParams.appltype}`
      );
      const result = await res.json();
      setData(result.productDetails || []);
      setExpandedProductNo(defaultProductNo); // Expand default product
      setIsLoading(false); // Set loading state to false after data is fetched
    };

    fetchData();
  }, [params, searchParams]);

  if (isLoading) {
    return <Loading />;
  }

  const handleToggle = (productNo) => {
    setExpandedProductNo(expandedProductNo === productNo ? null : productNo);
  };

  return (
    <div>
      <h1>
        Orange Book Product Details for {searchParams.appltype === "A" ? "ANDA" : "NDA"} {params.applno}
      </h1>
      <div style={{ marginTop: "20px" }}>
        {data.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            isExpanded={expandedProductNo === product.product_no}
            onToggle={() => handleToggle(product.product_no)}
          />
        ))}
      </div>
    </div>
  );
}

const ProductCard = ({ product, isExpanded, onToggle }) => {
  return (
    <div style={{ border: "1px solid #ccc", marginBottom: "10px" }}>
      <div
        onClick={onToggle}
        style={{
          backgroundColor: "#e0e0e0",
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {product.trade_name} ({product.ingredient}) <br />
        {product.strength} <br />
        Marketing Status: {product.type=='RX'?'Prescription':(product.type=='OTC'?'Over-the-counter':'Discontinued')}
      </div>
      {isExpanded && (
        <div style={{ padding: "10px" }}>
          <p><strong>Active Ingredient:</strong> {product.ingredient}</p>
          <p><strong>Proprietary Name:</strong> {product.trade_name}</p>
          <p><strong>Dosage Form, Route of Administration:</strong> {product.dosage_form}; {product.route}</p>
          <p><strong>Strength:</strong> {product.strength}</p>
          <p><strong>Reference Listed Drug:</strong> {product.rld}</p>
          <p><strong>Reference Standard:</strong> {product.rs}</p>
          <p><strong>TE Code:</strong> {product.te_code}</p>
          <p><strong>Application Number:</strong> {product.appl_no}</p>
          <p><strong>Product Number:</strong> {product.product_no}</p>
          <p><strong>Approval Date:</strong> {product.approval_date}</p>
          <p><strong>Applicant Holder Full Name:</strong> {product.applicant_full_name}</p>
          <p><strong>Marketing Status:</strong> {product.type}</p>
          <a href="#">Patent and Exclusivity Information</a>
        </div>
      )}
    </div>
  );
};
