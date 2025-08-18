import React, { useState, useEffect } from 'react';

const TopFiresTable = () => {
  const [fireData, setFireData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Years we want to show in the dropdown (2020-2024)
  const filteredYears = ['2024', '2023', '2022', '2021', '2020'];

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Top 20 Largest Fires</h1>
      <div>
        <label htmlFor="year-select">Filter by Year: </label>
        <select 
          id="year-select" 
          value={selectedYear} 
          onChange={handleYearChange}
        >
          <option value="">All Years</option>
          {filteredYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Size (Acres)</th>
            <th>Year</th>
            <th>Cause</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {fireData.map((fire, index) => (
            <tr key={index}>
              <td>{fire.size_acres.toLocaleString()}</td>
              <td>{fire.fireyear}</td>
              <td>{fire.statcause}</td>
              <td>{fire.firename || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopFiresTable;