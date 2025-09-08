// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    API_DOCS: '/v3/api-docs',
    RAINFALL_SEARCH: '/api/rainfall/search'
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,
  CHART_HEIGHT: 300,
  SNACKBAR_DURATION: 4000,
  LOADING_DELAY: 500
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#8884d8',
  SECONDARY: '#82ca9d',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3'
};

// Filter Defaults
export const FILTER_DEFAULTS = {
  SORT_BY: 'date',
  SORT_DIRECTION: 'asc',
  PAGE_SIZE: 365,
  PAGE_NUMBER: 0
};

// API Response Structure
export const API_RESPONSE_STRUCTURE = {
  DATA_FIELD: 'data',
  STATISTICS_FIELD: 'statistics',
  PAGINATION_FIELD: 'page'
}; 