import React, { useState, useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const FiresByYearChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://xlgjrlpuv8.execute-api.us-east-2.amazonaws.com/stage1/fires-by-year');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.length === 0 || !chartRef.current) return;

    const sortedData = [...chartData].sort((a, b) => parseInt(a.fireyear) - parseInt(b.fireyear));

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedData.map(item => item.fireyear),
        datasets: [{
          label: 'Number of Wildfires',
          data: sortedData.map(item => parseInt(item.total_fires)),
          backgroundColor: 'rgba(235, 107, 86, 0.7)',
          borderColor: 'rgba(235, 107, 86, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(235, 107, 86, 1)',
        }]
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (loading) return <div className="chart-loading">Loading wildfire data...</div>;
  if (error) return <div className="chart-error">Error loading data: {error}</div>;

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <canvas 
          ref={chartRef} 
        />
      </div>
    </div>
  );
};

export default FiresByYearChart;