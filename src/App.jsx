import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  WaterDrop as WaterDropIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import DemoData from './components/DemoData';

const API_BASE_URL = 'http://localhost:8080';

// Test axios configuration
console.log('Axios imported successfully:', axios);
console.log('API_BASE_URL:', API_BASE_URL);

// Simple network test function
const testNetworkConnection = async () => {
  console.log('=== NETWORK TEST START ===');
  
  // Test 1: Simple fetch to a known working endpoint
  try {
    console.log('Test 1: Testing basic network connectivity...');
    const testResponse = await fetch('https://httpbin.org/get');
    console.log('✓ Basic network connectivity: OK');
  } catch (err) {
    console.error('✗ Basic network connectivity: FAILED', err);
  }
  
  // Test 2: Test our API endpoint with fetch
  try {
    console.log('Test 2: Testing API endpoint with fetch...');
    const apiResponse = await fetch(`${API_BASE_URL}/api/rainfall/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: 0,
        size: 1
      })
    });
    console.log('✓ API endpoint with fetch: OK', apiResponse.status);
    const data = await apiResponse.json();
    console.log('✓ API data received:', data.data ? data.data.length : 0, 'records');
    console.log('✓ Statistics available:', !!data.statistics);
  } catch (err) {
    console.error('✗ API endpoint with fetch: FAILED', err);
  }
  
  // Test 3: Test our API endpoint with axios
  try {
    console.log('Test 3: Testing API endpoint with axios...');
    const axiosResponse = await axios.post(`${API_BASE_URL}/api/rainfall/search`, {
      page: 0,
      size: 1
    });
    console.log('✓ API endpoint with axios: OK', axiosResponse.status);
    console.log('✓ API data received:', axiosResponse.data.data ? axiosResponse.data.data.length : 0, 'records');
    console.log('✓ Statistics available:', !!axiosResponse.data.statistics);
  } catch (err) {
    console.error('✗ API endpoint with axios: FAILED', err);
    console.error('Axios error details:', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      statusText: err.response?.statusText
    });
  }
  
  // Test 4: Test with a simple ping endpoint
  try {
    console.log('Test 4: Testing simple ping...');
    const pingResponse = await fetch(`${API_BASE_URL}/v3/api-docs`);
    console.log('✓ Ping endpoint: OK', pingResponse.status);
  } catch (err) {
    console.error('✗ Ping endpoint: FAILED', err);
  }
  
  console.log('=== NETWORK TEST END ===');
};

function App() {
  const [rainfallData, setRainfallData] = useState([]);
  const [agriculturalYears, setAgriculturalYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(365);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Filter states
  const [filters, setFilters] = useState({
    agriculturalYear: '',
    startDate: null,
    endDate: null,
    minPrecipitation: '',
    maxPrecipitation: '',
    sortBy: 'date',
    sortDir: 'asc'
  });

  // Statistics states
  const [statistics, setStatistics] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    console.log('App component mounted, checking API connection...');
    checkApiConnection();
  }, []);

  useEffect(() => {
    console.log('API status changed to:', apiStatus);
    if (apiStatus === 'connected') {
      console.log('API connected, fetching data...');
      fetchAgriculturalYears();
      fetchRainfallData();
    }
  }, [apiStatus]);

  useEffect(() => {
    if (apiStatus === 'connected' && (currentPage !== 0 || pageSize !== 100)) {
      console.log('Pagination changed, refetching data...');
      fetchRainfallData();
    }
  }, [currentPage, pageSize, apiStatus]);

  const checkApiConnection = async () => {
    try {
      console.log('Attempting to connect to API at:', `${API_BASE_URL}/api/rainfall/search`);
      
      // Try axios first
      try {
        const response = await axios.post(`${API_BASE_URL}/api/rainfall/search`, {
          page: 0,
          size: 1
        }, { 
          timeout: 10000,
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        });
        console.log('API connection successful with axios:', response.status, response.data);
        setApiStatus('connected');
        showSnackbar('API connected successfully!', 'success');
        return;
      } catch (axiosError) {
        console.log('Axios failed, trying fetch:', axiosError.message);
        if (axiosError.code === 'ECONNABORTED') {
          console.error('Request timed out after 10 seconds');
        }
      }
      
      // Fallback to fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const fetchResponse = await fetch(`${API_BASE_URL}/api/rainfall/search`, {
          method: 'POST',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page: 0,
            size: 1
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }
        
        const data = await fetchResponse.json();
        console.log('API connection successful with fetch:', fetchResponse.status, data);
        setApiStatus('connected');
        showSnackbar('API connected successfully!', 'success');
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out after 10 seconds');
        }
        throw fetchError;
      }
      
    } catch (err) {
      console.error('API connection failed:', err);
      console.error('Error details:', {
        message: err.message,
        name: err.name,
        code: err.code,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      let errorMessage = `Unable to connect to the Rainfall Data API: ${err.message}`;
      
      // Check for CORS-related errors
      if (err.message.includes('CORS') || 
          err.message.includes('blocked by CORS policy') ||
          err.response?.status === 403) {
        errorMessage = 'CORS Error: The API server is not configured to allow requests from this frontend. Please configure CORS on your API server to allow origin: http://localhost:5173';
      }
      
      setApiStatus('error');
      setError(errorMessage);
      showSnackbar('API connection failed. Check if the server is running.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAgriculturalYears = async () => {
    try {
      console.log('Fetching agricultural years from search endpoint...');
      // Since we don't have a dedicated agricultural years endpoint, we'll extract them from search results
      const response = await axios.post(`${API_BASE_URL}/api/rainfall/search`, {
        page: 0,
        size: 1000 // Get a large sample to extract years
      });
      
      if (response.data && response.data.data) {
        const years = [...new Set(response.data.data.map(item => item.agriculturalYear))].sort();
        console.log('Agricultural years extracted from search results:', years);
        setAgriculturalYears(years);
      }
    } catch (err) {
      console.error('Error fetching agricultural years:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      showSnackbar('Failed to fetch agricultural years', 'warning');
    }
  };

  const fetchRainfallData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir
      };
      
      console.log('Fetching rainfall data with params:', params);
      const response = await axios.post(`${API_BASE_URL}/api/rainfall/search`, params);
      
      if (response.data && response.data.data) {
        console.log('Rainfall data fetched successfully:', response.data.data.length, 'records');
        setRainfallData(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageSize));
        
        // Update statistics if available
        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        } else {
          setStatistics(null);
        }
      } else {
        console.log('No data in response:', response.data);
        setRainfallData([]);
        setTotalPages(0);
        setStatistics(null);
      }
    } catch (err) {
      console.error('Error fetching rainfall data:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      setError('Error fetching rainfall data: ' + err.message);
      showSnackbar('Failed to fetch rainfall data', 'error');
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const searchRainfallData = async () => {
    setLoading(true);
    setError('');
    try {
      const searchParams = {
        ...filters,
        startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : undefined,
        endDate: filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : undefined,
        page: 0,
        size: pageSize
      };
      
      // Remove undefined values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined || searchParams[key] === '') {
          delete searchParams[key];
        }
      });
      
      console.log('Searching rainfall data with params:', searchParams);
      const response = await axios.post(`${API_BASE_URL}/api/rainfall/search`, searchParams);
      
      if (response.data && response.data.data) {
        console.log('Search results:', response.data.data.length, 'records');
        setRainfallData(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageSize));
        setCurrentPage(0);
        
        // Update statistics if available
        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        }
        
        showSnackbar(`Found ${response.data.data.length} records`, 'success');
      } else {
        setRainfallData([]);
        setTotalPages(0);
        setStatistics(null); // Clear statistics when no data
        showSnackbar('No records found', 'info');
      }
    } catch (err) {
      setError('Error searching rainfall data: ' + err.message);
      showSnackbar('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      agriculturalYear: '',
      startDate: null,
      endDate: null,
      minPrecipitation: '',
      maxPrecipitation: '',
      sortBy: 'date',
      sortDir: 'asc'
    });
    setStatistics(null); // Clear statistics when filters are cleared
    showSnackbar('Filters cleared', 'info');
  };

  const getMonthName = (month) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1] || month;
  };

  const prepareChartData = () => {
    if (!rainfallData.length) return [];
    
    const monthlyData = {};
    rainfallData.forEach(item => {
      // Parse the date string (e.g., "2024-10-15")
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      const monthKey = `${year}-${month}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          total: 0,
          count: 0,
          average: 0
        };
      }
      monthlyData[monthKey].total += item.precipitationMm;
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData).map(item => ({
      ...item,
      average: item.total / item.count
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const chartData = prepareChartData();

  if (apiStatus === 'checking') {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </LocalizationProvider>
    );
  }

  if (apiStatus === 'error') {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            <WaterDropIcon sx={{ mr: 2, color: 'primary.main' }} />
            Rainfall Data Dashboard
          </Typography>
          
          <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error">
              API Connection Failed
            </Typography>
            <Typography variant="body1" paragraph>
              Unable to connect to the Rainfall Data API at {API_BASE_URL}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please ensure the API server is running and accessible.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              Error: {error}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={checkApiConnection}
                startIcon={<RefreshIcon />}
              >
                Retry Connection
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  console.log('Manual test - checking API status...');
                  checkApiConnection();
                }}
              >
                Test Connection
              </Button>
              <Button 
                variant="outlined" 
                onClick={testNetworkConnection}
                color="secondary"
              >
                Run Network Test
              </Button>
            </Box>
          </Paper>

          {/* Show Demo Data */}
          <DemoData onRetryConnection={checkApiConnection} />
        </Container>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Connection Status */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip
            icon={<CheckCircleIcon />}
            label="API Connected"
            color="success"
            variant="outlined"
          />
          <Button 
            variant="outlined" 
            size="small" 
            onClick={checkApiConnection}
            sx={{ ml: 2 }}
          >
            Test Connection
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={testNetworkConnection}
            color="secondary"
            sx={{ ml: 1 }}
          >
            Network Test
          </Button>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          <WaterDropIcon sx={{ mr: 2, color: 'primary.main' }} />
          Rainfall Data Dashboard
        </Typography>

        {/* Filters Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            Search & Filter Options
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Agricultural Year</InputLabel>
                <Select
                  value={filters.agriculturalYear}
                  onChange={(e) => handleFilterChange('agriculturalYear', e.target.value)}
                  label="Agricultural Year"
                >
                  <MenuItem value="">All</MenuItem>
                  {agriculturalYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(newValue) => handleFilterChange('startDate', newValue)}
                maxDate={filters.endDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    helperText: 'Select the start date for filtering'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(newValue) => handleFilterChange('endDate', newValue)}
                minDate={filters.startDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    helperText: 'Select the end date for filtering'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Precipitation (mm)"
                type="number"
                value={filters.minPrecipitation}
                onChange={(e) => handleFilterChange('minPrecipitation', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Precipitation (mm)"
                type="number"
                value={filters.maxPrecipitation}
                onChange={(e) => handleFilterChange('maxPrecipitation', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="precipitationMm">Precipitation</MenuItem>
                  <MenuItem value="agriculturalYear">Agricultural Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort Direction</InputLabel>
                <Select
                  value={filters.sortDir}
                  onChange={(e) => handleFilterChange('sortDir', e.target.value)}
                  label="Sort Direction"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={searchRainfallData}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchRainfallData}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={{ mr: 1 }} />
                Search Results Statistics
              </Typography>
              
              {statistics ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {statistics.totalPrecipitation?.toFixed(1)} mm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Precipitation
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="secondary">
                          {statistics.averagePrecipitation?.toFixed(1)} mm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Daily Average
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {statistics.maxPrecipitation?.toFixed(1)} mm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Maximum Daily
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          {statistics.minPrecipitation?.toFixed(1)} mm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Minimum Daily
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Statistics will appear here when you search for rainfall data
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Monthly Precipitation Trends - Full Width */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            Monthly Precipitation Trends
          </Typography>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${getMonthName(parseInt(month))} ${year}`;
                }}
              />
              <YAxis />
              <RechartsTooltip 
                formatter={(value, name) => [value.toFixed(1) + ' mm', name]}
                labelFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${getMonthName(parseInt(month))} ${year}`;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Average Precipitation"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Total Precipitation"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Data Table Section */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} />
              Rainfall Data ({rainfallData.length} records)
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>Page Size</InputLabel>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Page Size"
                >
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                  <MenuItem value={365}>365</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Agricultural Year</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Precipitation (mm)</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rainfallData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.agriculturalYear} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {row.date}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WaterDropIcon sx={{ mr: 1, color: 'primary.main', fontSize: 'small' }} />
                            {row.precipitationMm} mm
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
}

export default App;
