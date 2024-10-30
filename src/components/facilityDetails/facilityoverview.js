export default function FacilityOverview({facilityoverview}) {
  return (
    <>
      <h2>Facility Details</h2>
      <p>
        <strong>Name:</strong> {facilityoverview.legal_name}
      </p>
      <p>
        <strong>FEI Number:</strong>{" "}
        {facilityoverview.fei_number}
      </p>
      <p>
        <strong>Firm Profile:</strong>{" "}
        <a
          href={facilityoverview.firm_profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          {facilityoverview.firm_profile}
        </a>
      </p>
      <p>
        <strong>Location:</strong>{" "}
        {facilityoverview.firm_address}
      </p>
    </>
  );
}
