import { post, put, get, del, getErrorMessage } from '@/lib/apiClient';

/**
 * Register a new team account
 */
export const registerEquipe = async (data) => {
  try {
    const response = await post('/equipe/register', data);
    return {
      success: true,
      user: response.user,
      team: response.team,
      message: response.message,
    };
  } catch (error) {
    console.error('Register equipe error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      errors: error.errors,
    };
  }
};

/**
 * Login as team account
 */
export const loginEquipe = async (telephone, password) => {
  try {
    const response = await post('/equipe/login', { telephone, password });
    return {
      success: true,
      token: response.token,
      user: response.user,
      message: response.message,
    };
  } catch (error) {
    console.error('Login equipe error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get authenticated team's information
 */
export const getMyTeam = async () => {
  try {
    const response = await get('/equipe/team');
    return {
      success: true,
      team: response.team,
    };
  } catch (error) {
    console.error('Get my team error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get team's players (bordereau)
 */
export const getMyPlayers = async () => {
  try {
    const response = await get('/equipe/players');
    return {
      success: true,
      players: response.players || [],
    };
  } catch (error) {
    console.error('Get my players error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Add a player to team's roster
 */
export const addPlayer = async (data) => {
  try {
    const response = await post('/equipe/players', data);
    return {
      success: true,
      player: response.player,
      message: response.message,
    };
  } catch (error) {
    console.error('Add player error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      errors: error.errors,
    };
  }
};

/**
 * Update a player in team's roster
 */
export const updatePlayer = async (playerId, data) => {
  try {
    const response = await put(`/equipe/players/${playerId}`, data);
    return {
      success: true,
      player: response.player,
      message: response.message,
    };
  } catch (error) {
    console.error('Update player error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      errors: error.errors,
    };
  }
};

/**
 * Delete a player from team's roster
 */
export const deletePlayer = async (playerId) => {
  try {
    const response = await del(`/equipe/players/${playerId}`);
    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    console.error('Delete player error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Update team information
 */
export const updateTeam = async (data) => {
  try {
    const response = await put('/equipe/team', data);
    return {
      success: true,
      team: response.team,
      message: response.message,
    };
  } catch (error) {
    console.error('Update team error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      errors: error.errors,
    };
  }
};

/**
 * Upload team logo
 */
export const uploadTeamLogo = async (logoFile) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);

    const response = await post('/equipe/team/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      logoUrl: response.logo_url,
      message: response.message,      
    };
  } catch (error) {
    console.error('Upload team logo error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      errors: error.errors,
    };
  }
};
