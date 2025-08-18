import React from 'react';
import './App.css'; // Make sure to create this CSS file
import TopFiresTable from './components/TopFiresTable';
import FiresByYearChart from './components/FiresByYearChart';

// Placeholder components - replace these with your actual visualization components
const FireDataTable = () => <div className="visualization-box">Fire Data Table Component</div>;
const FireMapVisualization = () => <div className="visualization-box">Fire Map Visualization</div>;
const FireTrendsChart = () => <div className="visualization-box">Fire Trends Over Time</div>;
const FireCausesPieChart = () => <div className="visualization-box">Fire Causes Breakdown</div>;

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Wildfire Dashboard</h1>
        <p className="subtitle">Tracking and analyzing wildfire data</p>
      </header>

      <div className="dashboard-container">
        {/* Row 1 */}
        <div className="dashboard-row">
          <div className="visualization-container">
            <h2>Top 20 Largest Fires</h2>
            <TopFiresTable />
          </div>
          
          <div className="visualization-container">
            <h2>Fires By Year</h2>
            <FiresByYearChart />
          </div>
        </div>

        {/* Row 2 */}
        <div className="dashboard-row">
          <div className="visualization-container">
            <h2>Trends Over Time</h2>
            <FireTrendsChart />
          </div>
          
          <div className="visualization-container">
            <h2>Causes Breakdown</h2>
            <FireCausesPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

