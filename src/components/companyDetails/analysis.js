import { useState } from "react";
import Limit from "../limit";
import Pagination from "../pagination"; // Import the Pagination component

export default function AnalysisTab({ data }) {
  const [selectedClassification, setSelectedClassification] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("All");
  const [selectedProjectArea, setSelectedProjectArea] = useState("All");
  const [selectedPostedCitation, setSelectedPostedCitation] = useState("All");
  const [limit, setLimit] = useState(10); // Default limit
  const [page, setPage] = useState(1); // Default page

  const handleFilterChange = (event) => {
    setSelectedClassification(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  const handleProductTypeChange = (event) => {
    setSelectedProductType(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  const handleProjectAreaChange = (event) => {
    setSelectedProjectArea(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  const handlePostedCitationChange = (event) => {
    setSelectedPostedCitation(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page when the limit changes
  };

  const clearFilters = () => {
    setSelectedClassification("All");
    setSelectedProductType("All");
    setSelectedProjectArea("All");
    setSelectedPostedCitation("All");
    setPage(1); // Reset to the first page when filters are cleared
  };

  const filteredData = data.inspectionDetails.filter((item) => {
    const isClassificationMatch =
      selectedClassification === "All" ||
      item.classification === selectedClassification;
    const isProductTypeMatch =
      selectedProductType === "All" ||
      item.product_type === selectedProductType;
    const isProjectAreaMatch =
      selectedProjectArea === "All" ||
      item.project_area === selectedProjectArea;
    const isPostedCitationMatch =
      selectedPostedCitation === "All" ||
      item.posted_citations === selectedPostedCitation;

    return (
      isClassificationMatch &&
      isProductTypeMatch &&
      isProjectAreaMatch &&
      isPostedCitationMatch
    );
  });

  // Calculate total pages based on filtered data and limit
  const totalPages = Math.ceil(filteredData.length / limit);

  // Slice the filtered data to apply the limit and page
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <>
      {/* Cards Section */}
      <div className="cards-container">
        <div className="card">
          <p className="card-title">Total Facilities</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalFacilities}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalInspections}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalPublished483s}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total Warning Letters</p>
          <p className="card-number">
            {data.companyAnalysisDetails.totalWarningLetters}
          </p>
        </div>
      </div>

      <div className="filter-container"
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ marginRight: "15px"}}>
          <label htmlFor="classification-filter">Classification: </label>
          <select
            id="classification-filter"
            value={selectedClassification}
            onChange={handleFilterChange}
          >
            <option value="All">All Classifications</option>
            {data.inspectionClassification.map((classification, index) => (
              <option key={index} value={classification.abbrevation}>
                {`${classification.classification} (${classification.abbrevation})`}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px"}}>
          <label htmlFor="product-type-filter">Product Type: </label>
          <select
            id="product-type-filter"
            value={selectedProductType}
            onChange={handleProductTypeChange}
          >
            <option value="All">All Product Types</option>
            {Array.from(
              new Set(data.inspectionDetails.map((item) => item.product_type))
            ).map((productType, index) => (
              <option key={index} value={productType}>
                {productType}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px"}}>
          <label htmlFor="project-area-filter">Project Area: </label>
          <select
            id="project-area-filter"
            value={selectedProjectArea}
            onChange={handleProjectAreaChange}
          >
            <option value="All">All Project Areas</option>
            {Array.from(
              new Set(data.inspectionDetails.map((item) => item.project_area))
            ).map((projectArea, index) => (
              <option key={index} value={projectArea}>
                {projectArea}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "15px"}}>
          <label htmlFor="posted-citation-filter">Posted Citation: </label>
          <select
            id="posted-citation-filter"
            value={selectedPostedCitation}
            onChange={handlePostedCitationChange}
          >
            <option value="All">All Posted Citations</option>
            {Array.from(
              new Set(
                data.inspectionDetails.map((item) => item.posted_citations)
              )
            ).map((postedCitation, index) => (
              <option key={index} value={postedCitation}>
                {postedCitation}
              </option>
            ))}
          </select>
        </div>
        <button onClick={clearFilters}>
          Clear All Filters
      </button>
      </div>

      <Limit onLimitChange={handleLimitChange} />
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Inspection Date</th>
            <th>Classification</th>
            <th>Product Type</th>
            <th>Project Area</th>
            <th>Posted Citations</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.legal_name}</td>
              <td>{new Date(item.inspection_date).toLocaleDateString()}</td>
              <td>{item.classification}</td>
              <td>{item.product_type}</td>
              <td>{item.project_area}</td>
              <td>{item.posted_citations}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  );
}
