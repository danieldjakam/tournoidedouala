/**
 * HTTP Client for API communication
 * Handles JWT authentication and error management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'auth_token';

class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Get stored JWT token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store JWT token
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Clear authentication token
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Make HTTP request with automatic error handling and JWT injection
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse response
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    // Handle HTTP errors
    if (!response.ok) {
      const message = data?.message || `HTTP ${response.status}`;
      const errors = data?.errors || null;
      throw new ApiError(message, response.status, errors);
    }

    return data || {};
  } catch (error) {
    // Network or parsing error
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError('Erreur réseau. Vérifiez votre connexion.', 0, null);
    }

    // Fallback
    throw new ApiError(error.message || 'Erreur serveur', 500, null);
  }
};

/**
 * GET request
 */
export const get = (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'GET' });
};

/**
 * POST request
 */
export const post = (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const put = (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const deleteRequest = (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'DELETE' });
};

/**
 * Extract error message from ApiError
 */
export const getErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  return error?.message || 'Une erreur est survenue';
};

/**
 * Get validation errors object
 */
export const getValidationErrors = (error) => {
  if (error instanceof ApiError && error.errors) {
    return error.errors;
  }
  return null;
};

export { ApiError };
