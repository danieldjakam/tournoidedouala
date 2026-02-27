import { post, get, getErrorMessage, ApiError } from '@/lib/apiClient';

/**
 * Vote for a match winner and/or man of the match
 */
export const voteMatch = async (matchId, teamVoteId, playerVoteId = null) => {
  try {
    const response = await post('/votes/match', {
      match_id: matchId,
      team_vote_id: teamVoteId,
      player_vote_id: playerVoteId,
    });

    return {
      success: true,
      vote: response.vote,
      message: response.message,
    };
  } catch (error) {
    console.error('Vote error:', error);

    const message = getErrorMessage(error);

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
 * Vote for tournament winner
 */
export const voteTournament = async (teamVoteId) => {
  try {
    const response = await post('/votes/tournament', {
      team_vote_id: teamVoteId,
    });

    return {
      success: true,
      vote: response.vote,
      message: response.message,
    };
  } catch (error) {
    console.error('Tournament vote error:', error);

    const message = getErrorMessage(error);

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
 * Get user's votes for matches
 */
export const getUserVotes = async () => {
  try {
    const response = await get('/votes/my-votes');
    return {
      success: true,
      votes: response.votes || [],
      tournament_vote: response.tournament_vote || null,
    };
  } catch (error) {
    console.error('Get votes error:', error);
    return {
      success: false,
      votes: [],
      tournament_vote: null,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get votes for a specific match
 */
export const getMatchVotes = async (matchId) => {
  try {
    const response = await get(`/matches/${matchId}/votes`);
    return {
      success: true,
      votes: response.votes || [],
    };
  } catch (error) {
    console.error('Get match votes error:', error);
    return {
      success: false,
      votes: [],
      error: getErrorMessage(error),
    };
  }
};
