"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import Limit from "@/components/limit";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Default selected types and additional filters
  const [selectedTypes, setSelectedTypes] = useState(["RX", "OTC"]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedTradename, setSelectedTradename] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [distinctIngredients, setDistinctIngredients] = useState([]);
  const [distinctTradenames, setDistinctTradenames] = useState([]);
  const [distinctApplicants, setDistinctApplicants] = useState([]);

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
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/orangebook/products?page=${page}&limit=${limit}`;

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

      const res = await fetch(url);
      const result = await res.json();
      setData(result.products);
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
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>
      <h1>Orange Book Products</h1>
      {/* Descriptions for TE Code, RLD, and RS */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Field Descriptions:</h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>TE Code:</strong> Therapeutic Equivalence Code indicates
            whether a drug is considered therapeutically equivalent to the
            reference listed drug (RLD). It helps determine substitutability.
          </li>
          <li>
            <strong>RLD (Reference Listed Drug):</strong> The drug product
            identified by the FDA as a standard for comparing bioequivalence.
          </li>
          <li>
            <strong>RS (Reference Standard):</strong> Indicates whether the
            product is a reference standard used for generic drug testing.
          </li>
        </ul>
      </div>

      {/* Type Filters */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("RX")}
            onChange={() => handleTypeChange("RX")}
          />
          RX(Prescription)
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("OTC")}
            onChange={() => handleTypeChange("OTC")}
          />
          Over the Counter
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("DISCN")}
            onChange={() => handleTypeChange("DISCN")}
          />
          Discontinued
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
              Market Status
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Active Ingredient
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Proprietary Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Application Number
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Dosage Form
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Route</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Strength
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              TE Code
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>RLD</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>RS</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Applicant Holder
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Approval Date
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
                <Link
                  style={{ color: "blue", textDecoration: "None" }}
                  href={`/orangebook/products/${item.appl_no}?productno=${item.product_no}&appltype=${item.appl_type}`}
                >
                  {item.appl_type}
                  {item.appl_no}
                </Link>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.dosage_form}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.route}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.strength}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.te_code == "NaN" ? "" : item.te_code}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.rld}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.rs}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.applicant_full_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.approval_date}
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
        totalRecords={totalCount}
      />
    </div>
  );
}
