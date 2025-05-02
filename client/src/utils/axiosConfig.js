import axios from 'axios';

// Configure axios for different environments
const setupAxios = () => {
  // Set the base URL based on environment
  // In development, the proxy in package.json handles this
  if (process.env.NODE_ENV === 'production') {
    // Set the base URL to the production server URL
    axios.defaults.baseURL = window.location.origin;
  }
  
  // Add a request interceptor to ensure proper content type handling for all environments
  axios.interceptors.request.use(
    config => {
      // Ensure JSON content type for all API requests
      if (config.url && config.url.startsWith('/api/')) {
        config.headers['Accept'] = 'application/json';
        // Also set Content-Type for non-FormData requests
        if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json';
        }
      }
      return config;
    },
    error => Promise.reject(error)
  );
  
  // Add a response interceptor to handle HTML responses
  axios.interceptors.response.use(
    response => response,
    error => {
      // If we received HTML instead of JSON, it's likely a server error page
      if (error.response && 
          error.response.headers && 
          error.response.headers['content-type'] && 
          error.response.headers['content-type'].includes('text/html')) {
        console.error('Invalid content type received: text/html; charset=UTF-8');
        
        // Log the response data for debugging
        if (error.response.data) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        
        // Create a more descriptive error message based on status code
        let errorMessage = 'Server error: Received HTML instead of JSON.';
        if (error.response.status === 404) {
          errorMessage = 'The requested API endpoint does not exist. Please check the server configuration.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error occurred. Please try again later or contact support.';
        }
        
        return Promise.reject({
          ...error,
          message: errorMessage
        });
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxios;