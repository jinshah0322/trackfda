'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from '../from483.module.css'; // Import the CSS module

const Page = () => {
  const [filters, setFilters] = useState({
    year: '2023',
    productType: 'Drugs',
    country: 'All',
    companyName: '',
  });

  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 5; // Number of items per page

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
        setData(result.data || []); // Update state with fetched data
        setFilteredData(result.data || []); // Initialize filtered data
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const years = [{ value: '2023', label: '2023' }, { value: '2024', label: '2024' }];
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
      const filtered = data.filter(
        (item) =>
          (!filters.year || item.record_date.startsWith(filters.year)) &&
          (!filters.productType || filters.productType === 'Drugs') &&
          (!filters.country || filters.country === 'All') &&
          (!searchTerm || item.legal_name.toLowerCase().includes(searchTerm))
      );
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

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const options = { day: '2-digit', month: 'short', year: 'numeric' }; // Formatting options
    return new Intl.DateTimeFormat('en-US', options).format(date); // Format the date
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
            defaultValue={{ value: '2023', label: '2023' }}
            onChange={(option) => handleFilterChange('year', option.value)}
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
                  <td>{formatDate(row.record_date)}</td>
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
