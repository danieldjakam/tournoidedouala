import { post, put, get, del, getErrorMessage } from '@/lib/apiClient';

/**
 * Get authenticated user's profile
 */
export const getProfile = async () => {
  try {
    const response = await get('/profile');
    return {
      success: true,
      user: response.user || response,
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Update user's profile (name, gender, birth date)
 */
export const updateProfile = async (data) => {
  try {
    const response = await put('/profile', data);
    return {
      success: true,
      user: response.user || response,
      message: response.message,
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
 * Update user's settings (password, phone, email)
 */
export const updateSettings = async (data) => {
  try {
    const response = await put('/profile/settings', data);
    return {
      success: true,
      user: response.user || response,
      message: response.message,
    };
  } catch (error) {
    console.error('Update settings error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get user statistics
 */
export const getProfileStats = async () => {
  try {
    const response = await get('/profile/stats');
    return {
      success: true,
      stats: response.stats || {},
    };
  } catch (error) {
    console.error('Get profile stats error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};
