import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with your API Gateway endpoint
  const API_URL = "https://xlgjrlpuv8.execute-api.us-east-2.amazonaws.com/stage1/fires-by-year";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(API_URL);
        // Assuming Lambda returns { year: "2020", fire_count: 123 }
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Wildfire Dashboard</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <BarChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fireyear" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_fires" fill="#ff5722" />
        </BarChart>
      )}
    </div>
  );
}

export default App;

