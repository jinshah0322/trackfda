"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import Limit from "@/components/limit";

export default function Page() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Default selected types and additional filters
  const [selectedTypes, setSelectedTypes] = useState(["RX", "OTC"]);
  const [expiryFilter, setExpiryFilter] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedTradename, setSelectedTradename] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [distinctIngredients, setDistinctIngredients] = useState([]);
  const [distinctTradenames, setDistinctTradenames] = useState([]);
  const [distinctApplicants, setDistinctApplicants] = useState([]);

  const expiryOptions = [
    { value: "1", label: "Expires in next 1 year" },
    { value: "2", label: "Expires in next 2 years" },
    { value: "5", label: "Expires in next 5 years" },
  ];

  useEffect(() => {
    // Fetch distinct values for ingredients, tradenames, and applicants
    const fetchDistinctValues = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orangebook/products/distinct-values`
      );
      const result = await res.json();
      setDistinctIngredients(result.ingredientList);
      setDistinctTradenames(result.tradenameList);
      setDistinctApplicants(result.applicantList);
    };

    fetchDistinctValues();
  }, []);

  const fetchData = async () => {
    if (selectedTypes.length === 0) {
      setData([]);
      setTotalCount(0); // Reset the count
      setIsLoading(false); // Stop loading indicator
    } else {
      setIsLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/orangebook/patents?page=${page}&limit=${limit}`;

      // Append selected filters to the URL
      if (selectedTypes.length > 0) {
        const typesQuery = selectedTypes
          .map((type) => `type=${type}`)
          .join("&");
        url += `&${typesQuery}`;
      }
      if (selectedIngredient) {
        url += `&ingredient=${selectedIngredient.value}`;
      }
      if (selectedTradename) {
        url += `&tradename=${selectedTradename.value}`;
      }
      if (selectedApplicant) {
        url += `&applicant=${selectedApplicant.value}`;
      }
      if (expiryFilter) {
        url += `&expiry_in_years=${expiryFilter.value}`;
      }

      const res = await fetch(url);
      const result = await res.json();
      setData(result.patents);
      setTotalCount(result.total_count);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    limit,
    selectedTypes,
    selectedIngredient,
    selectedTradename,
    selectedApplicant,
    expiryFilter
  ]);

  const handleTypeChange = (type) => {
    setSelectedTypes(
      (prevTypes) =>
        prevTypes.includes(type)
          ? prevTypes.filter((t) => t !== type) // Remove the type if already selected
          : [...prevTypes, type] // Add the type to selectedTypes if not already selected
    );
    setPage(1); // Reset the page to 1 when the filter changes
  };

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <Loading />;
  }

  // Transform the data for react-select dropdown
  const ingredientOptions = distinctIngredients.map((ingredient) => ({
    value: ingredient,
    label: ingredient,
  }));

  const tradenameOptions = distinctTradenames.map((tradename) => ({
    value: tradename,
    label: tradename,
  }));

  const applicantOptions = distinctApplicants.map((applicant) => ({
    value: applicant,
    label: applicant,
  }));

  return (
    <div>
      <h1>Orange Book Patents</h1>

      {/* Type Filters */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("RX")}
            onChange={() => handleTypeChange("RX")}
          />
          RX
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("OTC")}
            onChange={() => handleTypeChange("OTC")}
          />
          OTC
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("DISCN")}
            onChange={() => handleTypeChange("DISCN")}
          />
          DISCN
        </label>
      </div>

      {/* Ingredient Filter Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Active Ingredient:
          <Select
            options={ingredientOptions}
            value={selectedIngredient}
            onChange={setSelectedIngredient}
            placeholder="Select Active Ingredient"
            isClearable
            isSearchable
            styles={{ width: "250px" }}
          />
        </label>
      </div>

      {/* Trade Name Filter Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Proprietary Name:
          <Select
            options={tradenameOptions}
            value={selectedTradename}
            onChange={setSelectedTradename}
            placeholder="Select Proprietary Name"
            isClearable
            isSearchable
            styles={{ width: "250px" }}
          />
        </label>
      </div>

      {/* Applicant Filter Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Applicant Holder:
          <Select
            options={applicantOptions}
            value={selectedApplicant}
            onChange={setSelectedApplicant}
            placeholder="Select Applicant Holder"
            isClearable
            isSearchable
            styles={{ width: "250px" }}
          />
        </label>
      </div>

      {/* Expiry Filter Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Patent Expiry:
          <Select
            options={expiryOptions}
            value={expiryFilter}
            onChange={(selectedOption) => {
              setExpiryFilter(selectedOption);
              setPage(1); // Reset page when filter changes
            }}
            placeholder="Select Expiry Range"
            isClearable
          />
        </label>
      </div>

      {/* Limit Selector */}
      <Limit
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* Table displaying the filtered data */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Mkt. Status
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Active Ingredient
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Proprietary Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Applicant Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Patent No.
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Patent Expiry Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Drug Substance Flag
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Drug Product Flag
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Patent Use Code
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Delist Flag
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Submission Date
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.type}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.ingredient}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.trade_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.applicant_full_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.patent_no}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(item.patent_expire_date).toLocaleDateString("en-GB")}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.drug_substance_flag}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.drug_product_flag}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.patent_use_code}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.delist_flag}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(item.submission_date).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        page={totalPages === 0 ? 0 : page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
