import React from 'react';
import '../app/compliancematrics.css'

const InspectionTable = ({ data ,matricName}) => {
    const metricNames = data && data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'legal_name') : [];
    return (
        <div className="inspection-table-container">
            <h2>{matricName}</h2>
            <table className="inspection-table">
                <thead>
                    <tr>
                        <th>Metrics</th>
                        {data && data.map((company, index) => (
                            <th key={index}>{company.legal_name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {metricNames.map((metric, index) => (
                        <tr key={index}>
                            <td>{formatMetricName(metric)}</td>
                            {data && data.map((company, subIndex) => (
                                <td key={subIndex}>{company[metric]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper function to format metric names from camelCase or snake_case to Title Case
const formatMetricName = (metric) => {
    return metric
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default InspectionTable;
