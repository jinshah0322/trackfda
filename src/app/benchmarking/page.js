"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import "../compliancematrics.css";
import InspectionTable from "@/components/copmarisionmatrix";
import Loading from "@/components/loading";
import Link from "next/link";

export default function Page() {
  const [companies, setCompanies] = useState(["", ""]);
  const [companyNameList, setCompanyNameList] = useState([]);
  const [years, setYears] = useState({ fromYear: "2018", toYear: "2024" });
  const [loading, setLoading] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [inspectionMetricData, setInspectionMetricData] = useState(null);
  const [form483sMetricData, setform483sMetricData] = useState(null);
  const [investigatorsMetricData, setInvestigatorsMetricData] = useState(null);
  const [warninglettersMetricData,setwarninglettersMetricData]= useState(null);

  async function getCompanyNameList() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/benchmarking`,
        { method: "GET" }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data`, error);
      return [];
    }
  }

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const companyData = await getCompanyNameList();
        if (companyData) {
          setCompanyNameList(companyData);
          setFilteredOptions(
            companyData.slice(0, 10).map((company) => ({
              value: company.legal_name,
              label: company.legal_name,
            }))
          );
        }
      } catch (error) {
        console.error(`No Data Found`);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  // Generate all years
  const allYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

  // Filtered year options based on selection
  const fromYearOptions = allYears
    .filter((year) => year <= parseInt(years.toYear))
    .map((year) => ({ value: year, label: year.toString() }));

  const toYearOptions = allYears
    .filter((year) => year >= parseInt(years.fromYear))
    .map((year) => ({ value: year, label: year.toString() }));

  const handleCompanyChange = (index, selectedOption) => {
    const newCompanies = [...companies];
    newCompanies[index] = selectedOption ? selectedOption.value : "";
    setCompanies(newCompanies);
  };

  const handleCompare = async () => {
    const dataToSend = {
      companyNames: companies.filter((name) => name),
      years: { fromYear: years.fromYear, toYear: years.toYear },
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/benchmarking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setInspectionMetricData(result.inspectionMetric);
      setform483sMetricData(result.form483sMetric);
      setInvestigatorsMetricData(result.investigatorsMetric);
      setwarninglettersMetricData(result.warninglettersMetric);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleYearChange = (yearType, selectedOption) => {
    const newYear = selectedOption.value;

    if (yearType === "fromYear" && parseInt(newYear) > parseInt(years.toYear)) {
      alert("From Year cannot be greater than To Year");
      return;
    }

    if (yearType === "toYear" && parseInt(newYear) < parseInt(years.fromYear)) {
      alert("To Year cannot be less than From Year");
      return;
    }

    setYears((prevYears) => ({
      ...prevYears,
      [yearType]: newYear,
    }));
  };

  const addCompanyField = () => {
    if (companies.length < 4) {
      setCompanies([...companies, ""]);
    }
  };

  const removeCompanyField = (index) => {
    if (companies.length > 2) {
      const newCompanies = companies.filter((_, i) => i !== index);
      setCompanies(newCompanies);
    }
  };

  const handleInputChange = (inputValue) => {
    if (!inputValue) {
      setFilteredOptions(
        companyNameList.slice(0, 10).map((company) => ({
          value: company.legal_name,
          label: company.legal_name,
        }))
      );
    } else {
      const filtered = companyNameList
        .filter((company) =>
          company.legal_name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 10)
        .map((company) => ({
          value: company.legal_name,
          label: company.legal_name,
        }));
      setFilteredOptions(filtered);
    }
  };

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div className="compliance-metrics-container">
      <div className="breadcrumb">
        <Link href="/">← Back to Dashboard</Link>
      </div>

      <h2>Compare FDA Compliance Metrics</h2>
      <p>Compare up to 4 companies on FDA Compliance Metrics</p>

      <div className="year-selectors">
        <div className="year-selector">
          <label>From Year</label>
          <Select
            options={fromYearOptions}
            value={fromYearOptions.find(
              (option) => option.value.toString() === years.fromYear
            )}
            onChange={(selectedOption) =>
              handleYearChange("fromYear", selectedOption)
            }
            placeholder="Select Year"
            isClearable={false}
            styles={{ container: (base) => ({ ...base, width: "100px" }) }}
          />
        </div>

        <div className="year-selector">
          <label>To Year</label>
          <Select
            options={toYearOptions}
            value={toYearOptions.find(
              (option) => option.value.toString() === years.toYear
            )}
            onChange={(selectedOption) =>
              handleYearChange("toYear", selectedOption)
            }
            placeholder="Select Year"
            isClearable={false}
            styles={{ container: (base) => ({ ...base, width: "100px" }) }}
          />
        </div>
      </div>

      <div className="company-inputs">
        {companies.map((company, index) => (
          <div key={index} className="company-input">
            <div className="company-input-header">
              <label>{`Company ${index + 1}:`}</label>
              {index >= 2 && (
                <button
                  className="remove-company-button"
                  onClick={() => removeCompanyField(index)}
                >
                  &times;
                </button>
              )}
            </div>
            <Select
              options={filteredOptions}
              value={filteredOptions.find((option) => option.value === company)}
              onChange={(selectedOption) =>
                handleCompanyChange(index, selectedOption)
              }
              onInputChange={handleInputChange}
              placeholder="Select Company Name"
              isClearable
              isSearchable
              styles={{ container: (base) => ({ ...base, width: "100%" }) }}
            />
          </div>
        ))}
        {companies.length < 4 && (
          <button onClick={addCompanyField} className="add-company-button">
            + Add Company
          </button>
        )}
      </div>

      <button className="compare-button" onClick={handleCompare}>
        Compare
      </button>

      {inspectionMetricData && (
        <InspectionTable
          data={inspectionMetricData}
          matricName={"Inspection"}
        />
      )}
      {form483sMetricData && (
        <InspectionTable data={form483sMetricData} matricName={"Form483s"} />
      )}
      {investigatorsMetricData && (
        <InspectionTable
          data={investigatorsMetricData}
          matricName={"Investigators"}
        />
      )}
      {warninglettersMetricData && (
        <InspectionTable data={warninglettersMetricData} matricName={"Warning Letters"}/>
      )}
    </div>
  );
}
