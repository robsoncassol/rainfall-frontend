# Rainfall Data Dashboard

A modern, interactive dashboard for visualizing and analyzing rainfall data through a REST API. Built with React, Material-UI, and Recharts for beautiful data visualization.

## Features

### 🔍 **Advanced Search & Filtering**
- **Agricultural Year Filter**: Filter by specific agricultural years (e.g., 2024-25)
- **Date Range Filtering**: Filter by year, month, day, or date ranges
- **Precipitation Thresholds**: Set minimum and maximum precipitation values
- **Flexible Sorting**: Sort by multiple fields in ascending/descending order
- **Pagination**: Navigate through large datasets with configurable page sizes

### 📊 **Data Visualization**
- **Monthly Trends Chart**: Interactive line chart showing precipitation trends over time
- **Statistics Dashboard**: Key metrics including total, average, min, and max precipitation
- **Agricultural Year Statistics**: Comprehensive statistics for selected agricultural years
- **Responsive Charts**: Beautiful, interactive charts that work on all devices

### 📋 **Data Management**
- **Real-time Data**: Live data fetching from the API
- **Data Table**: Clean, sortable table with rainfall records
- **Record Details**: View individual rainfall data entries
- **Export Ready**: Data formatted for easy analysis and export

## API Endpoints Supported

The dashboard integrates with the Rainfall Data API using the following endpoint:

- `POST /api/rainfall/search` - Search rainfall data with flexible filters and return data with statistics

### API Response Structure

The search endpoint returns a unified response containing both data and statistics:

```json
{
  "data": [
    {
      "id": 1,
      "agriculturalYear": "2024-25",
      "date": "2024-10-15",
      "precipitationMm": 25.5
    }
  ],
  "statistics": {
    "totalPrecipitation": 1250.75,
    "averagePrecipitation": 12.5,
    "minPrecipitation": 0.0,
    "maxPrecipitation": 85.2
  }
}
```

### Search Capabilities

The search endpoint supports all the filtering options:
- Agricultural year filtering
- Date range filtering (startDate, endDate in YYYY-MM-DD format)
- Precipitation thresholds
- Pagination and sorting
- Combined statistics for filtered results

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- The Rainfall Data API running on `http://localhost:8080`

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rainfall-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## Usage

### Getting Started
1. **Launch the Dashboard**: Open your browser and navigate to the dashboard URL
2. **View Data**: The dashboard automatically loads the latest rainfall data
3. **Apply Filters**: Use the filter panel to narrow down your data search
4. **Analyze Trends**: View charts and statistics for insights
5. **Export Data**: Use the data table to copy or analyze specific records

### Filter Options

#### Basic Filters
- **Agricultural Year**: Select from available agricultural years
- **Calendar Year**: Filter by specific calendar year
- **Month**: Filter by month (1-12)
- **Day**: Filter by specific day of month

#### Advanced Filters
- **Date Range**: Set start and end years/months
- **Precipitation Range**: Set minimum and maximum precipitation thresholds
- **Sorting**: Choose sort fields and direction

#### Search Actions
- **Search**: Apply all active filters
- **Reset**: Clear filters and reload original data
- **Clear Filters**: Remove all filter values

### Data Visualization

#### Statistics Cards
- **Total Precipitation**: Sum of all rainfall in the selected period
- **Daily Average**: Average daily rainfall
- **Maximum Daily**: Highest single-day rainfall
- **Minimum Daily**: Lowest single-day rainfall

#### Trend Charts
- **Monthly Trends**: Line chart showing precipitation patterns over time
- **Interactive Tooltips**: Hover over chart points for detailed information
- **Dual Metrics**: View both average and total precipitation trends

## Technology Stack

- **Frontend Framework**: React 19
- **UI Components**: Material-UI (MUI) v5
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)

## API Configuration

The dashboard is configured to connect to the Rainfall Data API at `http://localhost:8080`. To change the API endpoint:

1. Edit `src/App.jsx`
2. Update the `API_BASE_URL` constant
3. Restart the development server

## Customization

### Theme Customization
The Material-UI theme can be customized in `src/main.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    // Add more customizations...
  },
});
```

### Adding New Charts
To add new visualizations:

1. Import additional chart components from Recharts
2. Add new chart sections to the dashboard
3. Create data processing functions for the new charts
4. Update the UI layout as needed

### Extending Filters
To add new filter options:

1. Add new filter state variables
2. Create filter input components
3. Update the filter object structure
4. Modify the API request logic

## Troubleshooting

### Common Issues

#### API Connection Errors
- Ensure the Rainfall Data API is running on `http://localhost:8080`
- Check API documentation at `http://localhost:8080/v3/api-docs`
- Verify CORS settings on the API server

#### CORS Configuration Issue ⚠️
**This is the most common issue!** If you see a connection error, it's likely due to CORS configuration.

The API server needs to be configured to allow requests from the frontend origin. You'll see a 403 Forbidden error if CORS is not properly configured.

**Solution**: Configure your API server to include the following CORS headers:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**For Spring Boot (if applicable)**, add this to your configuration:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

**For development, you can temporarily allow all origins**:
```
Access-Control-Allow-Origin: *
```

#### Chart Display Issues
- Ensure data is properly formatted for chart components
- Check browser console for JavaScript errors
- Verify Recharts library is properly installed

#### Filter Not Working
- Check filter state management
- Verify API request payload format
- Ensure filter values are valid

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the API documentation
- Review the browser console for errors
- Ensure all dependencies are properly installed
- Verify API server connectivity
