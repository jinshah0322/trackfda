"use client";

import { useState } from 'react';

const prompts = [
    {
        prompt: `Write a summary for an FDA inspection report based on the following structure:
Begin by stating that the FDA issued a [Form 483/Warning Letter] during an inspection, identifying regulatory violations.
Mention the specific regulatory requirements violated and provide a brief description of the key issues, referencing any applicable guidelines or statements.
Provide a concise summary of the inspection findings, explaining the associated risks posed by the violations.
Highlight the root causes of the violations.
Incorporate bullet points that include specific examples from the observations, if available.
Ensure the summary is clear, concise, and professionally written in 200 words.
`,
        results: [
            { url: "https://www.fda.gov/media/182398/download", result: `The FDA issued a Form 483 following an inspection at BSO LLC's outsourcing facility in Lakewood, Colorado, identifying significant regulatory violations. Key issues included inadequate validation of sterilization processes, insufficient employee training, undefined production phase time limits, failure to investigate unexplained discrepancies, and non-compliance with stability testing programs, violating regulatory requirements for ensuring drug product safety and effectiveness.

The inspection revealed deficiencies in the firm's microbiological contamination prevention procedures, where sterilization validation lacked evidence of reproducibility and adequate impact assessments. Employees also lacked the necessary training to identify critical defects in products. Furthermore, defined time limits for production phases were absent, and unexplained particulate matter discrepancies in injectable products were not thoroughly investigated. The firm's stability testing program was also inadequate, lacking data to support the 360-day beyond-use dates for certain products.

Root causes of these violations include insufficient sterility process validation, poor training protocols, inadequate production oversight, and deficient stability data management.

- Sterilization validation lacking evidence of dose mapping reproducibility.
- Visual inspection program deficiencies, lacking critical defect examples.
- Absence of established hold times for production phases.
- Lack of investigations for particulate findings in injections.
- Stability testing program not substantiated by adequate data.
` },
            { url: "https://www.fda.gov/media/182397/download", result: `The FDA issued a Form 483 following an inspection at Annovex Pharma, Inc. from August 26 to September 6, 2024, identifying multiple regulatory violations. The violations pertained primarily to inadequate procedures for preventing microbiological contamination and failure to comply with standard aseptic processing guidelines.

Key issues included: 
- Inadequate validation of the aseptic process, with deficiencies in the media fill program and improper incubation of units.
- Failure to thoroughly investigate unexplained discrepancies, including discarding contaminated units without scientific justification and neglecting HEPA filter leak test failures.
- Insufficient monitoring of environmental conditions in aseptic processing areas, notably the lack of effective smoke studies under dynamic conditions.
- Missing written procedures for the storage of components, drug product containers, and closures.
- Lack of necessary product information on drug labels.

These violations pose significant risks, potentially compromising the sterility and safety of the drug products. Root causes of these issues appear to be procedural inadequacies and oversight in thorough staff training and environmental control.

Specific examples include:
- Only a subset of syringes incubated during media fill.
- No procedures for HEPA filter failures or scientific justification for discarding contaminated syringes.
- Absence of labeling information required by the FD&C Act.

The company did not file required biannual reports for compounded drugs, indicating systemic reporting failures.
` }
        ]
    },
    {
        prompt:    `Write a summary for an FDA inspection report based on the following structure:
Begin by stating that the FDA issued a [Form 483/Warning Letter] during an inspection. Mention the specific regulatory requirements violated  and briefly describe the key issues identified with any act guild line or any other stament
Provide a concise summary of the inspection findings and explain the risks posed.
Highlight the root causes of the violations .
Ensure the summary is clear, concise, ignore the dates, and professionally written in 165 words in bullet points
`,
        results: [
            { url: "https://www.fda.gov/media/182398/download", result: `- The FDA issued a Form 483 following an inspection at BSO LLC, an outsourcing facility, due to violations of regulatory requirements related to microbiological contamination prevention, employee training, production timelines, discrepancy reviews, and stability testing.

- Key issues identified include inadequate validation of the sterilization process for sterile drug products, lack of adequate employee training in visual inspection for liquid injectables, undefined production phase timelines, insufficient investigation into particulate contamination, and an unsupported beyond-use date (BUD) for Anastrozole pellets.

- The inspection findings pose significant risks, including potential contamination of sterile products, compromised product quality, and patient safety due to the distribution of products without appropriate stability data.

- Root causes of the violations include:
  - Inadequate sterilization validation and failure to properly document or scientifically justify sterilization cycles.
  - Insufficient training procedures and lack of comprehensive visual inspection protocol for detecting defects.
  - Absence of established hold times in production and failure to investigate discrepancies like particulate contamination.
  - Non-compliance with stability testing program requirements.` },
            { url: "https://www.fda.gov/media/182397/download", result: `- The FDA issued a Form 483 during an inspection of Annovex Pharma, Inc., citing violations of regulatory requirements under the Federal Food, Drug, and Cosmetic Act.

- Key issues identified include:
  - Inadequate validation of aseptic processes, risking microbiological contamination in purportedly sterile drug products.
  - Failure to thoroughly review discrepancies or failure of batches to meet specifications.
  - Deficient environmental condition monitoring in aseptic processing areas.
  - Absence of detailed written procedures for the storage of components and products.
  - Missing required information on drug product labels as per Section 503B(a)(10)(A) of the FD&C Act.
  - Non-submission of a report identifying compounded drugs from the previous six months.

- Risks posed by these findings include potential contamination of sterile products, inadequate quality assurance, non-compliance with labeling regulations, and lack of transparency regarding compounding practices.

- Root causes of the violations include insufficient procedural rigor, lack of thorough quality investigations, and incomplete regulatory compliance processes.` }
        ]
    },
    {
        prompt: `Write a summary for an FDA inspection report based on the following structure:
Begin by stating that the FDA issued a [Form 483/Warning Letter] during an inspection, identifying regulatory violations.
Mention the specific regulatory requirements violated and provide a brief description of the key issues, referencing any applicable guidelines or statements.
Provide a concise summary of the inspection findings, explaining the associated risks posed by the violations.
Highlight the root causes of the violations.
Incorporate bullet points that include specific examples from the observations, if available.
Ensure the summary is clear, concise, and professionally written in 200 words.`,
        results: [
            { url: "https://www.fda.gov/media/182398/download", result: `The FDA issued a Form 483 following an inspection at BSO LLC's outsourcing facility in Lakewood, Colorado, identifying significant regulatory violations. Key issues included inadequate validation of sterilization processes, insufficient employee training, undefined production phase time limits, failure to investigate unexplained discrepancies, and non-compliance with stability testing programs, violating regulatory requirements for ensuring drug product safety and effectiveness.

The inspection revealed deficiencies in the firm's microbiological contamination prevention procedures, where sterilization validation lacked evidence of reproducibility and adequate impact assessments. Employees also lacked the necessary training to identify critical defects in products. Furthermore, defined time limits for production phases were absent, and unexplained particulate matter discrepancies in injectable products were not thoroughly investigated. The firm's stability testing program was also inadequate, lacking data to support the 360-day beyond-use dates for certain products.

Root causes of these violations include insufficient sterility process validation, poor training protocols, inadequate production oversight, and deficient stability data management.

- Sterilization validation lacking evidence of dose mapping reproducibility.
- Visual inspection program deficiencies, lacking critical defect examples.
- Absence of established hold times for production phases.
- Lack of investigations for particulate findings in injections.
- Stability testing program not substantiated by adequate data.` },
            { url: "https://www.fda.gov/media/182397/download", result: `The FDA issued a Form 483 following an inspection at Annovex Pharma, Inc. from August 26 to September 6, 2024, identifying multiple regulatory violations. The violations pertained primarily to inadequate procedures for preventing microbiological contamination and failure to comply with standard aseptic processing guidelines.

Key issues included: 
- Inadequate validation of the aseptic process, with deficiencies in the media fill program and improper incubation of units.
- Failure to thoroughly investigate unexplained discrepancies, including discarding contaminated units without scientific justification and neglecting HEPA filter leak test failures.
- Insufficient monitoring of environmental conditions in aseptic processing areas, notably the lack of effective smoke studies under dynamic conditions.
- Missing written procedures for the storage of components, drug product containers, and closures.
- Lack of necessary product information on drug labels.

These violations pose significant risks, potentially compromising the sterility and safety of the drug products. Root causes of these issues appear to be procedural inadequacies and oversight in thorough staff training and environmental control.

Specific examples include:
- Only a subset of syringes incubated during media fill.
- No procedures for HEPA filter failures or scientific justification for discarding contaminated syringes.
- Absence of labeling information required by the FD&C Act.

The company did not file required biannual reports for compounded drugs, indicating systemic reporting failures.` }
        ]
    } ,{
        prompt: `Write a summary for an FDA inspection report based on the following structure: Check and summarize each observation in maximum 50 words, from key violation points, key issues identified, key regulatory requirements and breach, inspection findings, root cause. Add overall summary from summarize points in bullet points`,
        results: [
            { url: "https://www.fda.gov/media/182398/download", result: `### FDA Inspection Report Summary: BSO LLC

#### Observation 1: Inadequate Sterilization Validation
- **Key Issue:** Inefficient sterilization validation for sterile pellets.
- **Regulatory Breach:** Non-compliance with validation process requirements for sterility.
- **Findings:** Lack of evidence for dose mapping material; undefined material attenuation and scattering properties; potency drop post-sterilization.
- **Root Cause:** Inadequate documentation and scientific justification for sterilization cycles.

#### Observation 2: Insufficient Employee Training
- **Key Issue:** Visual inspection program inadequacies.
- **Regulatory Breach:** Employees lack necessary training for visual inspection.
- **Findings:** Incomplete examples of defects in training material; insufficient instruction for using equipment during inspections.
- **Root Cause:** Deficient training procedures and documentation.

#### Observation 3: Lack of Time Limits for Production Phases
- **Key Issue:** Missing established hold times between manufacturing and sterilization phases.
- **Regulatory Breach:** Non-compliance with time limits to assure product quality.
- **Findings:** Anastrozole pellets held for extended periods before sterilization.
- **Root Cause:** Absence of defined hold times in manufacturing protocols.

#### Observation 4: Inadequate Investigation of Discrepancies
- **Key Issue:** Failure to investigate discrepancies in product quality.
- **Regulatory Breach:** Incomplete review of unexplained discrepancies in drug products.
- **Findings:** Lack of investigations into particulate contamination in liquid injectables.
- **Root Cause:** Ineffective SOP protocol for handling critical defects.

#### Observation 5: Non-compliance with Stability Testing Programs
- **Key Issue:** Insufficient stability data.
- **Regulatory Breach:** Incomplete stability testing program for 360-day BUD claims.
- **Findings:** Missing stability data for Anastrozole pellet doses.
- **Root Cause:** Inadequate stability testing procedures.

### Overall Summary
- The inspection revealed significant deficiencies in sterilization validation, employee training, production timing, discrepancy investigations, and stability testing.
- Key issues include inadequate documentation, insufficient training materials, undefined production protocols, and incomplete stability testing.
- Corrective actions are necessary to ensure compliance with FDA regulations.` },
            { url: "https://www.fda.gov/media/182397/download", result: `**FDA Inspection Report Summary for Annovex Pharma, Inc. (8/26/2024 - 9/6/2024)**  

**Observation 1:**   
- **Violation:** Inadequate validation of aseptic processes.
- **Issues Identified:** Incomplete incubation of media fill units and use of unverified media powder in aseptic simulations.
- **Regulatory Breach:** Non-compliance with sterility assurance processes.
- **Root Cause:** Lack of scientific justification for incomplete incubation and inadequate media verification procedures.

**Observation 2:**  
- **Violation:** Failure to investigate discrepancies and batch failures.  
- **Issues Identified:** Discarded contaminated syringes without investigation, and HEPA filter issue left unresolved.  
- **Regulatory Breach:** Non-adherence to comprehensive batch failure review protocols.  
- **Root Cause:** Inadequate investigative procedures and lack of a HEPA filter evaluation policy.

**Observation 3:**    
- **Violation:** Inadequate environmental monitoring in aseptic processing.  
- **Issues Identified:** Smoke studies not conducted under dynamic production conditions.  
- **Regulatory Breach:** Failing to simulate actual production environment to verify unidirectional airflow.  
- **Root Cause:** Incomplete representation of production conditions in smoke studies.

**Observation 4:**    
- **Violation:** Lack of defined storage procedures.  
- **Issues Identified:** No temperature monitoring in the storage area for drug products.  
- **Regulatory Breach:** Failure to maintain proper storage conditions.  
- **Root Cause:** Absence of storage environmental control procedures.

**Observation 5:**    
- **Violation:** Missing production and control records.  
- **Issues Identified:** Media fill records were unavailable for past dates.  
- **Regulatory Breach:** Non-compliance with record maintenance and availability.  
- **Root Cause:** Failure in record-keeping and retrieval system.

**Observation 6:**    
- **Violation:** Incomplete drug product labeling.  
- **Issues Identified:** Labels missing required ingredient details.  
- **Regulatory Breach:** Non-compliance with FD&C Act Section 503B(a)(10)(A) requirements.  
- **Root Cause:** Inadequate labeling practices.

**Observation 7:**    
- **Violation:** Lack of required biannual drug compounding reports to FDA.  
- **Issues Identified:** Missing product entries in June 2024 report.  
- **Regulatory Breach:** Non-compliance with FDA reporting requirements.  
- **Root Cause:** Deficient protocols for compiling and submitting reports.

**Overall Summary:**  
- Deficiencies in aseptic validation and environmental monitoring exacerbate cross-contamination concerns.
- Inadequate record-keeping and reporting reflect operational and regulatory compliance gaps.
- Lack of written procedures for key processes, particularly storage and product labeling, indicate systemic oversight issues.` }
        ]
    }
];

export default function DropdownPage() {
    const [selectedPromptIndex, setSelectedPromptIndex] = useState(-1);

    const handleSelectionChange = (event) => {
        setSelectedPromptIndex(Number(event.target.value));
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#eef2f3', borderRadius: '10px', maxWidth: '900px', margin: '20px auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>FDA Report Summary Viewer</h1>
        <label htmlFor="dropdown" style={{ display: 'block', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', color: '#444' }}>Choose a report:</label>
        <select
            id="dropdown"
            value={selectedPromptIndex}
            onChange={handleSelectionChange}
            style={{ display: 'block', width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', marginBottom: '25px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
        >
            <option value="-1">--Select a report--</option>
            {prompts.map((_, index) => (
                <option key={index} value={index}>Prompt {index + 1}</option>
            ))}
        </select>
    
        {selectedPromptIndex !== -1 && (
           <div
           style={{
               backgroundColor: '#fff',
               padding: '25px',
               borderRadius: '8px',
               boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
               marginTop: '20px',
           }}
       >
           <h2 style={{ color: '#222', marginBottom: '15px' }}>Selected Prompt</h2>
           <pre
               style={{
                   color: '#555',
                   marginBottom: '20px',
                   whiteSpace: 'pre-wrap',
                   fontSize: '15px',
                   lineHeight: '1.6',
                   backgroundColor: '#f9f9f9',
                   padding: '15px',
                   borderRadius: '5px',
               }}
           >
               {prompts[selectedPromptIndex].prompt}
           </pre>
           {prompts[selectedPromptIndex].results.map((result, index) => (
               <div
                   key={index}
                   style={{
                       marginBottom: '20px',
                       paddingBottom: '15px',
                       borderBottom: '1px solid #ddd',
                   }}
               >
                  <div
    style={{
        display: 'flex',
        alignItems: 'center', // Ensures vertical alignment of text and URL
        gap: '10px', // Adds spacing between the label and the URL
    }}
>
    <p
        style={{
            margin: '0',
            fontWeight: 'bold',
            color: '#222',
            flexShrink: 0, // Prevents the label from shrinking
        }}
    >
        Form 483 URL:
    </p>
    <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
            textDecoration: 'none',
            color: '#007BFF',
            flex: 1, // Allows the URL to take available space
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}
    >
        {result.url}
    </a>
</div>

                   <p
                       style={{
                           margin: '10px 0 0',
                           fontWeight: 'bold',
                           color: '#222',
                       }}
                   >
                       Result:
                   </p>
                   <pre
                       style={{
                           margin: '5px 0',
                           color: '#555',
                           whiteSpace: 'pre-wrap',
                           fontSize: '14px',
                           backgroundColor: '#f7f7f7',
                           padding: '10px',
                           borderRadius: '5px',
                           overflowX: 'auto',
                       }}
                   >
                       {result.result}
                   </pre>
               </div>
           ))}
       </div>
       
        )}
    </div>
    
    );
}
