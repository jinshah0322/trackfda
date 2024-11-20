'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from '../from483.module.css'; // Import the CSS module

const Page = () => {
  const [filters, setFilters] = useState({
    year: 'All',
    productType: 'Drugs',
    country: 'All',
    companyName: '',
  });

  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [years, setYears] = useState([]); // State for unique years

  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 10; // Number of items per page

  async function getFrom483() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/from483`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFrom483();
        console.log('Fetched data:', result.data); // Debug: Log fetched data

        const rawData = result.data || [];
        setData(rawData); // Update state with fetched data
        setFilteredData(rawData); // Initialize filtered data

        // Extract unique years from record_date, ignoring invalid dates
        const uniqueYears = Array.from(
          new Set(
            rawData
              .map((item) => {
                const date = new Date(item.record_date);
                return !isNaN(date) ? date.getFullYear().toString() : null;
              })
              .filter((year) => year !== null) // Remove invalid or null years
          )
        )
          .sort((a, b) => b - a); // Sort years in descending order

        // Add "All" option at the top of the list
        const yearOptions = [{ value: 'All', label: 'All' }, ...uniqueYears.map((year) => ({ value: year, label: year }))];
        setYears(yearOptions);

        // Set the default year to "All"
        setFilters((prev) => ({
          ...prev,
          year: 'All',
        }));
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const productTypes = [{ value: 'Drugs', label: 'Drugs' }];
  const countries = [{ value: 'All', label: 'All' }];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Debounced search input handling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchTerm = filters.companyName.toLowerCase();
      const filtered = data.filter((item) => {
        const yearMatches =
          filters.year === 'All' || new Date(item.record_date).getFullYear().toString() === filters.year;
        const productTypeMatches = !filters.productType || filters.productType === 'Drugs';
        const countryMatches = !filters.country || filters.country === 'All';
        const companyNameMatches =
          !searchTerm || item.legal_name.toLowerCase().includes(searchTerm);

        return yearMatches && productTypeMatches && countryMatches && companyNameMatches;
      });
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page
    }, 300); // 300ms debounce time

    return () => clearTimeout(timeoutId);
  }, [filters, data]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Recent Form 483s</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Issue Year:</label>
          <Select
            options={years}
            value={years.find((option) => option.value === filters.year)}
            onChange={(option) => handleFilterChange('year', option?.value || '')}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Product Type:</label>
          <Select
            options={productTypes}
            defaultValue={{ value: 'Drugs', label: 'Drugs' }}
            onChange={(option) => handleFilterChange('productType', option.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Country:</label>
          <Select
            options={countries}
            defaultValue={{ value: 'All', label: 'All' }}
            onChange={(option) => handleFilterChange('country', option.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Company Name:</label>
          <input
            type="text"
            placeholder="All"
            value={filters.companyName}
            onChange={(e) => handleFilterChange('companyName', e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Issue Date</th>
              <th>Company Name</th>
              <th>Product Type</th>
              <th>483 Analysis</th>
              <th>Converted to Warning Letter</th>
              <th>Warning Letter Analysis</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <tr key={index}>
                  <td>{row.record_date}</td>
                  <td>{row.legal_name}</td>
                  <td>Drugs</td>
                  <td>{row.form483 || 'N/A'}</td>
                  <td>{row.converted || '---'}</td>
                  <td>{row.warningLetter || '---'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
