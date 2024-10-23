export function AnalysisTab({ data }) {
    return (
      <>
        <div className="card">
          <p className="card-title">Total Facilities</p>
          <p className="card-number">{data?.totalFacilities}</p>
        </div>
  
        <div className="card">
          <p className="card-title">Total Inspections</p>
          <p className="card-number">{data?.totalInspections}</p>
        </div>
  
        <div className="card">
          <p className="card-title">Total Published 483</p>
          <p className="card-number">{data?.totalPublished483s}</p>
        </div>
  
        <div className="card">
          <p className="card-title">Total Warning Letters</p>
          <p className="card-number">{data?.totalWarningLetters}</p>
        </div>
      </>
    );
  }
  
export function FacilitiesTab() {
    return (
      <>
        <h1>Facilities</h1>
      </>
    );
}  

export function Form483sTab({ data }) {
  return (
    <>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Form 483s available for this company.</h2>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Posted Date
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Company Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                FEI Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.date_posted}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.legal_name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.fei_number}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(item.download_link, "_blank")}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}


export function WarningLettersTab({data}) {
  return (
    <>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <h2>No Warning letter available for this company.</h2>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Issue Date
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Company Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                FEI Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Issuing Office
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Subject
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.letterissuedate}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.legal_name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.fei_number}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.issuingoffice}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.fei_number}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(item.warningletterurl, "_blank")}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}