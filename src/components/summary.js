import Head from 'next/head';
import '../app/Analysis.css';

export default function AnalysisPage() {
  return (
    <div className="container">
      <Head>
        <title>483 Analysis</title>
      </Head>

      <header className="header">
        <a href="#" className="back-link">&larr; Back to 483 list</a>
        <h1 className="title">Avenue Pharmacy Inc dba Pathway Pharmacy</h1>
        <button className="view-form-btn">View Form 483</button>
      </header>

      <nav className="tabs">
        <button className="tab active">483 Analysis</button>
        <button className="tab">Facility Details</button>
        <button className="tab">Audit Readiness Checklist</button>
      </nav>

      <main className="main-content">
        <div className="summary-cards">
          <div className="card">
            <h3>Total Observations</h3>
            <p>2</p>
          </div>
          <div className="card">
            <h3>Inspection Dates</h3>
            <p>01 Oct 2024 to 04 Oct 2024</p>
          </div>
          <div className="card">
            <h3>Issued On</h3>
            <p>04 Oct 2024</p>
          </div>
        </div>

        <section className="summary">
          <h2>Overall Summary #AI</h2>
          <ul>
            <li>The FDA Form 483 outlines serious compliance issues at Avenue Pharmacy Inc, including potency discrepancies and contamination risks.</li>
            <li>Observations include inadequate HVAC controls and cleanroom standards, endangering product integrity.</li>
            <li>The document reveals an urgency for immediate remediation to prevent potential patient harm and regulatory actions.</li>
            <li>Failure to rectify could lead to more severe regulatory consequences and undermine patient trust.</li>
          </ul>
        </section>

        <section className="observation">
          <h2>Observation 1</h2>
          <p>Drug potency failures in multiple lots impact quality, safety, and compliance of released products.</p>
          <div className="tabs">
            <button className="tab active">Sample Testing</button>
            <button className="tab">Batch Release</button>
          </div>
          <div className="observation-details">
            <div className="detail possible-root-cause">
              <h3>Possible Root Cause</h3>
              <p>Inadequate testing methods or errors in execution leading to incorrect potency readings.</p>
            </div>
            <div className="detail corrective-action">
              <h3>Corrective Action</h3>
              <p>Review and update testing protocols; retrain staff on correct sample testing procedures.</p>
            </div>
          </div>
          <button className="view-analysis-btn">View detailed Analysis</button>
        </section>
      </main>
    </div>
  );
}
