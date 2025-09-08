import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Chip
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const DemoData = ({ onRetryConnection }) => {
  const demoRainfallData = [
    {
      id: 1,
      agriculturalYear: "2024-25",
      year: 2024,
      month: 10,
      day: 15,
      precipitationMm: 25.5
    },
    {
      id: 2,
      agriculturalYear: "2024-25",
      year: 2024,
      month: 10,
      day: 16,
      precipitationMm: 18.2
    },
    {
      id: 3,
      agriculturalYear: "2024-25",
      year: 2024,
      month: 10,
      day: 17,
      precipitationMm: 32.1
    },
    {
      id: 4,
      agriculturalYear: "2024-25",
      year: 2024,
      month: 10,
      day: 18,
      precipitationMm: 12.8
    },
    {
      id: 5,
      agriculturalYear: "2024-25",
      year: 2024,
      month: 10,
      day: 19,
      precipitationMm: 45.3
    }
  ];

  const demoStatistics = {
    agriculturalYear: "2024-25",
    totalPrecipitation: 133.9,
    averagePrecipitation: 26.8,
    minPrecipitation: 12.8,
    maxPrecipitation: 45.3
  };

  const demoAgriculturalYears = ["2023-24", "2024-25", "2025-26"];

  return (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
          <Typography variant="h6" color="info.main">
            Demo Mode - API Not Connected
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          The dashboard is currently showing demo data because it cannot connect to the Rainfall Data API. 
          This allows you to explore the interface and see how the dashboard will look with real data.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          To connect to real data, ensure the API server is running on http://localhost:8080 and click the retry button below.
        </Typography>
        <Button 
          variant="contained" 
          onClick={onRetryConnection}
          sx={{ mt: 1 }}
        >
          Retry API Connection
        </Button>
      </Paper>

      {/* Demo Statistics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Demo Statistics for {demoStatistics.agriculturalYear}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`Total: ${demoStatistics.totalPrecipitation} mm`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`Average: ${demoStatistics.averagePrecipitation} mm`} 
            color="secondary" 
            variant="outlined"
          />
          <Chip 
            label={`Max: ${demoStatistics.maxPrecipitation} mm`} 
            color="success" 
            variant="outlined"
          />
          <Chip 
            label={`Min: ${demoStatistics.minPrecipitation} mm`} 
            color="info" 
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Demo Data Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Demo Rainfall Data (5 sample records)
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Agricultural Year</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Precipitation (mm)</th>
              </tr>
            </thead>
            <tbody>
              {demoRainfallData.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{row.id}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <Chip 
                      label={row.agriculturalYear} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {`${row.year}-${String(row.month).padStart(2, '0')}-${String(row.day).padStart(2, '0')}`}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {row.precipitationMm} mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Available Demo Features:</strong> Filter controls, statistics display, data table, and responsive layout. 
          All data shown is sample data and will be replaced with real API data when connected.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DemoData; 