'use client'
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Form483sTab from '@/components/companyDetails/form483';
import Loading from '@/components/loading';

export default function Page() {
    const [subPartNameList, setSubPartNameList] = useState([]); // Initialized as empty arrays
    const [sectionNameList, setSectionNameList] = useState([]);
    const [partNumberNameList, setPartNumberNameList] = useState([]);
    const [selectedPartNumberName, setSelectedPartNumberName] = useState(null);
    const [selectedSubPartName, setSelectedSubPartName] = useState(null);
    const [selectedSectionName, setSelectedSectionName] = useState(null);
    const [from483Data, setFrom483Data] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subsystem`, { method: 'GET' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true);
                const fetchedData = await fetchData();
                if (fetchedData) {
                    setSubPartNameList(fetchedData.subPartName || []); // Use fallback to empty array
                    setSectionNameList(fetchedData.sectionName || []);
                    setPartNumberNameList(fetchedData.partNumberName || []);
                    setFrom483Data(fetchedData.found483 || []);
                } else {
                    console.error("No data found");
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);
    
    const handleSearch = async () => {
        const dataToSend = {
            partNumberName: selectedPartNumberName?.value || '',
            subPartName: selectedSubPartName?.value || '',
            sectionName: selectedSectionName?.value || '',
        };
    
    
        setLoading(true);
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subsystem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            setFrom483Data(result.found483 || []); 
        } catch (error) {
            console.error('Error sending request:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dropdown formatting
    const partNumbers = partNumberNameList.map(partNumberName => ({
        value: partNumberName,
        label: partNumberName,
    }));

    const subPartNames = subPartNameList.map(subPartName => ({
        value: subPartName,
        label: subPartName,
    }));

    const sectionNames = sectionNameList.map(sectionName => ({
        value: sectionName,
        label: sectionName,
    }));

    return (
        <>
            <h1 style={styles.title}>Subsystem</h1>
            <div style={styles.formContainer}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Partnumber Name:</label>
                    <Select
                        options={partNumbers}
                        value={selectedPartNumberName}
                        onChange={(e) => setSelectedPartNumberName(e)}
                        placeholder="Select Partnumber Name"
                        isClearable
                        isSearchable
                        styles={{ container: (base) => ({ ...base, width: "100%" }) }}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Subpart Name:</label>
                    <Select
                        options={subPartNames}
                        value={selectedSubPartName}
                        onChange={(e) => setSelectedSubPartName(e)}
                        placeholder="Select Subpart Name"
                        isClearable
                        isSearchable
                        styles={{ container: (base) => ({ ...base, width: "100%" }) }}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Section Name:</label>
                    <Select
                        options={sectionNames}
                        value={selectedSectionName}
                        onChange={(e) => setSelectedSectionName(e)}
                        placeholder="Select Section Name"
                        isClearable
                        isSearchable
                        styles={{ container: (base) => ({ ...base, width: "100%" }) }}
                    />
                </div>
            </div>

            <div style={styles.buttonContainer}>
                <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            <div>
                {loading ? (
                    <Loading></Loading>
                ) : (
                     <Form483sTab data={from483Data} /> 
                )}
            </div>
        </>
    );
}
// Inline styles
const styles = {
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '8px',
    },
    label: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#555',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    searchButton: {
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '200px',
    }
};
