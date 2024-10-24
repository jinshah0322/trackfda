export default function AnalysisTab({ data }) {
    return (
      <>
        {/* Cards Section */}
        <div className="cards-container">
          <div className="card">
            <p className="card-title">Total Facilities</p>
            <p className="card-number">{data.companyAnalysisDetails.totalFacilities}</p>
          </div>
  
          <div className="card">
            <p className="card-title">Total Inspections</p>
            <p className="card-number">{data.companyAnalysisDetails.totalInspections}</p>
          </div>
  
          <div className="card">
            <p className="card-title">Total Published 483</p>
            <p className="card-number">{data.companyAnalysisDetails.totalPublished483s}</p>
          </div>
  
          <div className="card">
            <p className="card-title">Total Warning Letters</p>
            <p className="card-number">{data.companyAnalysisDetails.totalWarningLetters}</p>
          </div>
        </div>
  
        {/* Table Section */}
        <div className="inspection-table-container">
          {data.inspectionDetails.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <h2>No inspections conducted for this company.</h2>
            </div>
          ) : (
            <table className="inspection-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Fei Number</th>
                  <th>Project Area</th>
                  <th>Product Type</th>
                  <th>Classification</th>
                  <th>Posted Citation</th>
                </tr>
              </thead>
              <tbody>
                {data.inspectionDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.legal_name}</td>
                    <td>{item.fei_number}</td>
                    <td>{item.project_area}</td>
                    <td>{item.product_type}</td>
                    <td>{item.classification}</td>
                    <td>{item.posted_citations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }