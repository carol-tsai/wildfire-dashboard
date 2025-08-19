import React, { useState, useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import './FiresByYearChart.css'; 

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
        setLoading(true);
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
          backgroundColor: 'rgba(231, 76, 60, 0.8)',
          borderColor: 'rgba(192, 57, 43, 1)',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: 'rgba(192, 57, 43, 0.9)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#2c3e50',
              font: {
                family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
                size: 14,
                weight: '600'
              },
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(44, 62, 80, 0.95)',
            titleFont: {
              family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
              size: 14
            },
            bodyFont: {
              family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
              size: 13
            },
            padding: 12,
            cornerRadius: 6,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(233, 236, 239, 0.8)'
            },
            ticks: {
              color: '#555',
              font: {
                family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Number of Fires',
              color: '#2c3e50',
              font: {
                family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
                size: 14,
                weight: '600'
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(233, 236, 239, 0.5)'
            },
            ticks: {
              color: '#555',
              font: {
                family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Year',
              color: '#2c3e50',
              font: {
                family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
                size: 14,
                weight: '600'
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (loading) return (
    <div className="chart-loading-container">
      <div className="chart-spinner"></div>
      <p>Loading wildfire data...</p>
    </div>
  );
  
  if (error) return (
    <div className="chart-error-container">
      <div className="chart-error-icon">⚠️</div>
      <h3>Error Loading Chart Data</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="chart-retry-button">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>Wildfires by Year</h2>
        <div className="chart-info">
          Total fires per year
        </div>
      </div>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default FiresByYearChart;