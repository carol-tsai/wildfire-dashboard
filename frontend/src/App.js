import React from 'react';
import './App.css'; // Make sure to create this CSS file
import TopFiresTable from './components/TopFiresTable';
import FiresByYearChart from './components/FiresByYearChart';

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
            <TopFiresTable />
          </div>
          
          <div className="visualization-container">
            <FiresByYearChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

