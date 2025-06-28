// src/services/api.js
import axios from 'axios';
import { getToken } from './auth';

// Base URL for API requests
const API_URL = '/api/v1';

// Setup axios defaults
axios.defaults.baseURL = API_URL;

// Add a request interceptor to include the auth token
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // For auth errors, let the auth service handle them
    // Don't redirect here as we're using direct Keycloak auth
    return Promise.reject(error);
  }
);

/**
 * Get all available dashboards
 */
export const getDashboards = async () => {
  try {
    const response = await axios.get('/dashboards/');
    return response.data;
  } catch (error) {
    console.error('Failed to get dashboards', error);
    throw error;
  }
};

/**
 * Get dashboard categories
 */
export const getDashboardCategories = async () => {
  try {
    const response = await axios.get('/dashboards/categories/');
    return response.data.categories;
  } catch (error) {
    console.error('Failed to get dashboard categories', error);
    throw error;
  }
};

/**
 * Get a specific dashboard by ID
 */
export const getDashboard = async (id) => {
  try {
    const response = await axios.get(`/dashboards/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get dashboard with ID ${id}`, error);
    throw error;
  }
};

/**
 * Get authentication configuration
 */
export const getAuthConfig = async () => {
  try {
    const response = await axios.get('/auth/auth-config');
    return response.data;
  } catch (error) {
    console.error('Failed to get auth config', error);
    throw error;
  }
};

/**
 * Exchange authorization code for tokens
 */
export const exchangeCodeForToken = async (code, redirectUri) => {
  try {
    const response = await axios.post('/auth/token', {
      code,
      redirect_uri: redirectUri
    });
    return response.data;
  } catch (error) {
    console.error('Failed to exchange code for token', error);
    throw error;
  }
};

/**
 * Get user info from backend
 */
export const getUserInfo = async (token) => {
  try {
    const response = await axios.get('/auth/userinfo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get user info', error);
    throw error;
  }
};

/**
 * Get all API tokens
 */
export const getTokens = async (token) => {
  try {
    const response = await axios.get('/tokens', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get tokens', error);
    throw error;
  }
};

/**
 * Create a new API token
 */
export const createToken = async (tokenData, authToken) => {
  try {
    const response = await axios.post('/tokens', tokenData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create token', error);
    throw error;
  }
};

/**
 * Revoke an API token
 */
export const revokeToken = async (tokenId, authToken) => {
  try {
    await axios.delete(`/tokens/${tokenId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  } catch (error) {
    console.error('Failed to revoke token', error);
    throw error;
  }
};

/**
 * Refresh authentication token
 */
export const refreshAuthToken = async (refreshToken) => {
  try {
    const response = await axios.post('/auth/refresh-token', {
      refresh_token: refreshToken
    });
    return response.data;
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw error;
  }
};

// Export axios instance as default for direct API calls
export default axios;