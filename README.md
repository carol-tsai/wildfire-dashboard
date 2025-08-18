# Wildfire Dashboard 🌲🔥

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://carol-tsai.github.io/wildfire-dashboard/)
![GitHub last commit](https://img.shields.io/github/last-commit/carol-tsai/wildfire-dashboard)

An interactive dashboard visualizing wildfire data across the United States, featuring historical trends and top fire incidents.

![Dashboard Screenshot](./screenshots/dashboard-preview.png)  
*(Screenshot placeholder - add your actual screenshot later)*

## Features

- 📊 **Wildfires by Year**: Interactive bar chart showing fire frequency trends
- 🔥 **Top 20 Largest Fires**: Filterable table with acreage and cause data
- 🗺️ **Geographical Distribution** (Coming Soon)
- 📈 **Trend Analysis** (Coming Soon)
- 📱 Fully responsive design

## Live Demo

Experience the dashboard:  
👉 [https://carol-tsai.github.io/wildfire-dashboard/](https://carol-tsai.github.io/wildfire-dashboard/)

## Technologies Used

- React.js
- Chart.js (for data visualizations)
- GitHub Pages (for deployment)
- AWS API Gateway (data source)

## Data Sources

All data comes from official wildfire records via:
- [National Interagency Fire Center](https://www.nifc.gov/)
- Processed through custom API endpoints

## Installation

To run locally:

```bash
git clone https://github.com/carol-tsai/wildfire-dashboard.git
cd wildfire-dashboard/frontend
npm install
npm start