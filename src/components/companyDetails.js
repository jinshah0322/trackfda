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

export function Form483sTab() {
  return (
    <>
      <h1>Published 483</h1>
    </>
  );
}

export function WarningLettersTab() {
  return (
    <>
      <h1>Warning Letters</h1>
    </>
  );
}