import { post, get, getToken, setToken, clearToken, getErrorMessage, ApiError } from '@/lib/apiClient';

const CURRENT_USER_KEY = 'current_user';

/**
 * Clear stored user data
 */
export const clearStoredUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Map frontend fields to backend fields
 */
const mapUserToBackend = (userData) => {
  return {
    prenom: userData.firstname,
    nom: userData.name,
    telephone: userData.phone,
    indicatif_pays: userData.countryCode || '+237',
    email: userData.email || null,
    sexe: userData.gender === 'homme' ? 'M' : 'F',
    date_naissance: userData.dateOfBirth,
    password: userData.password,
  };
};

/**
 * Map backend user to frontend format
 */
const mapUserToFrontend = (backendUser) => {
  return {
    id: backendUser.id,
    firstname: backendUser.prenom,
    name: backendUser.nom,
    phone: backendUser.telephone,
    email: backendUser.email || '',
    gender: backendUser.sexe === 'M' ? 'homme' : 'femme',
    dateOfBirth: backendUser.date_naissance,
    countryCode: backendUser.indicatif_pays || '+237',
    role: backendUser.role || 'user',
    points: backendUser.points || 0,
  };
};

/**
 * Register new user
 */
export const registerUser = async (userData) => {
  try {
    const backendData = mapUserToBackend(userData);
    const response = await post('/auth/register', backendData);

    if (response.user) {
      const mappedUser = mapUserToFrontend(response.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mappedUser));

      return {
        success: true,
        user: mappedUser,
        message: response.message,
      };
    }

    return {
      success: false,
      error: response.message || 'Erreur lors de l\'inscription',
    };
  } catch (error) {
    console.error('Register error:', error);

    const message = getErrorMessage(error);

    // Handle validation errors from backend
    if (error instanceof ApiError && error.errors) {
      const fieldErrors = Object.entries(error.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('\n');

      return {
        success: false,
        error: fieldErrors,
      };
    }

    return {
      success: false,
      error: message,
    };
  }
};

/**
 * Login user
 */
export const loginUser = async (phone, password) => {
  try {
    const response = await post('/auth/login', {
      telephone: phone,
      password: password,
    });

    if (response.token && response.user) {
      // Store JWT token
      setToken(response.token);

      // Map and store user
      const mappedUser = mapUserToFrontend(response.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mappedUser));

      return {
        success: true,
        user: mappedUser,
        token: response.token,
        message: response.message,
      };
    }

    return {
      success: false,
      error: response.message || 'Erreur de connexion',
    };
  } catch (error) {
    console.error('Login error:', error);

    const message = getErrorMessage(error);

    // Status 401 = invalid credentials
    if (error instanceof ApiError && error.status === 401) {
      // Clear any stale data
      clearToken();
      clearStoredUser();
      return {
        success: false,
        error: 'Numéro de téléphone ou mot de passe incorrect',
      };
    }

    return {
      success: false,
      error: message,
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    // Try to notify backend
    if (getToken()) {
      await post('/auth/logout', {});
    }
  } catch (error) {
    console.warn('Logout API call failed:', error);
  } finally {
    // Always clear local state
    clearToken();
    clearStoredUser();
  }
};

/**
 * Get current logged in user
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
};

/**
 * Refresh JWT token
 */
export const refreshToken = async () => {
  try {
    const response = await post('/auth/refresh', {});

    if (response.token) {
      setToken(response.token);
      return {
        success: true,
        token: response.token,
      };
    }

    return {
      success: false,
      error: 'Impossible de rafraîchir le token',
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    clearToken();
    clearStoredUser();

    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get authenticated user from backend
 */
export const fetchCurrentUser = async () => {
  try {
    const user = await get('/auth/me');

    if (user) {
      const mappedUser = mapUserToFrontend(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mappedUser));
      return {
        success: true,
        user: mappedUser,
      };
    }

    return {
      success: false,
      error: 'Impossible de charger les données utilisateur',
    };
  } catch (error) {
    console.error('Fetch user error:', error);

    // If 401, token is invalid
    if (error instanceof ApiError && error.status === 401) {
      clearToken();
      clearStoredUser();
    }

    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (identifier) => {
  try {
    // TODO: Implement on backend
    // const response = await post('/auth/forgot-password', { identifier });
    
    return {
      success: true,
      message: 'Si un compte existe, vous recevrez un email de réinitialisation',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    // TODO: Implement on backend (PUT /api/users/{id})
    
    return {
      success: false,
      error: 'Non implémenté côté serveur',
    };
  } catch (error) {
    console.error('Update profile error:', error);
    
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  try {
    // TODO: Implement on backend (GET /api/users - admin only)
    const users = [];
    return users;
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  try {
    // TODO: Implement on backend
    // const response = await post('/auth/reset-password', { token, password: newPassword });
    
    return {
      success: false,
      error: 'Non implémenté côté serveur',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};