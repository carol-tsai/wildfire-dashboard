import React, { useState, useEffect } from 'react';
import './TopFiresTable.css'; 

const TopFiresTable = () => {
  const [fireData, setFireData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'size_acres', direction: 'descending' });

  useEffect(() => {
    const fetchFireData = async () => {
      try {
        setLoading(true);
        let url = 'https://xlgjrlpuv8.execute-api.us-east-2.amazonaws.com/stage1/largest-fires';
        
        if (selectedYear) {
          url += `?year=${selectedYear}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFireData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFireData();
  }, [selectedYear]);

  // Years we want to show in the dropdown (2015-2024)
  const filteredYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...fireData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [fireData, sortConfig]);

  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading fire data...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="fires-table-container">
      <div className="table-header">
        <h2>Largest Wildfires</h2>
        <div className="filter-controls">
          <label htmlFor="year-select" className="filter-label">Filter by Year:</label>
          <select 
            id="year-select" 
            value={selectedYear} 
            onChange={handleYearChange}
            className="year-select"
          >
            <option value="">All Years</option>
            {filteredYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <span className="results-count">
            {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="fires-table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('size_acres')}
                className="sortable-header"
              >
                Size (Acres) {getSortDirectionIcon('size_acres')}
              </th>
              <th 
                onClick={() => handleSort('fireyear')}
                className="sortable-header"
              >
                Year {getSortDirectionIcon('fireyear')}
              </th>
              <th 
                onClick={() => handleSort('statcause')}
                className="sortable-header"
              >
                Cause {getSortDirectionIcon('statcause')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((fire, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="size-cell">{fire.size_acres.toLocaleString()}</td>
                  <td className="year-cell">{fire.fireyear}</td>
                  <td className="cause-cell">{fire.statcause}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No fire data available for the selected year
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopFiresTable;