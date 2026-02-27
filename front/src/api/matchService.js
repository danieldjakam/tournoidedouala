import { get, getErrorMessage } from '@/lib/apiClient';
import { isAfter, isBefore, subMinutes, addMinutes } from 'date-fns';

/**
 * Get all matches with optional filters
 */
export const getMatches = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.status) params.append('statut', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await get(`/matches${query}`);

    return {
      success: true,
      matches: response.data || [],
      pagination: {
        total: response.total,
        per_page: response.per_page,
        current_page: response.current_page,
        last_page: response.last_page,
      },
    };
  } catch (error) {
    console.error('Get matches error:', error);
    return {
      success: false,
      matches: [],
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get a specific match with composition
 */
export const getMatch = async (matchId) => {
  try {
    const response = await get(`/matches/${matchId}`);

    return {
      success: true,
      match: response.match,
      composition: response.composition,
      userVote: response.user_vote || null,
    };
  } catch (error) {
    console.error('Get match error:', error);
    return {
      success: false,
      match: null,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get user's vote for a specific match
 */
export const getMyVoteForMatch = async (matchId) => {
  try {
    const response = await get(`/matches/${matchId}/my-vote`);
    return {
      success: true,
      vote: response.vote,
      hasVoted: response.has_voted,
    };
  } catch (error) {
    console.error('Get my vote error:', error);
    return {
      success: false,
      vote: null,
      hasVoted: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get upcoming matches (planifiés)
 */
export const getUpcomingMatches = async () => {
  return await getMatches({ status: 'planifie' });
};

/**
 * Get live matches (en cours)
 */
export const getLiveMatches = async () => {
  return await getMatches({ status: 'en_cours' });
};

/**
 * Get finished matches (terminés)
 */
export const getFinishedMatches = async () => {
  return await getMatches({ status: 'termine' });
};

/**
 * Check if prognosis for a match is locked (match has started)
 */
export const isMatchPronosticLocked = (match) => {
  const now = new Date();
  if (!match.date_match) return false;

  const matchStart = new Date(match.date_match);
  return isAfter(now, matchStart);
};

/**
 * Check if user can vote for a match
 * Can only vote if: match is 'planifie' AND user hasn't voted yet
 */
export const canUserVote = (match, hasUserVoted = false) => {
  // User can't vote if already voted
  if (hasUserVoted) return false;
  
  // User can't vote if match has started
  if (isMatchPronosticLocked(match)) return false;
  
  // User can only vote if match is planned
  return match.statut === 'planifie';
};

/**
 * Get all teams
 */
export const getTeams = async () => {
  try {
    const response = await get('/teams');
    return {
      success: true,
      teams: response.data || response.teams || [],
    };
  } catch (error) {
    console.error('Get teams error:', error);
    return {
      success: false,
      teams: [],
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get team by ID
 */
export const getTeam = async (teamId) => {
  try {
    const response = await get(`/teams/${teamId}`);
    // Backend returns { data: team } - make sure to extract correctly
    return {
      success: true,
      team: response.data || response.team,
    };
  } catch (error) {
    console.error('Get team error:', error);
    return {
      success: false,
      team: null,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Check if tournament prognosis is locked (first match has started)
 */
export const isTournamentPronosticLocked = async () => {
  try {
    const result = await getUpcomingMatches();
    if (!result.success || result.matches.length === 0) return false;

    // Sort by date and check first match
    const sorted = [...result.matches].sort(
      (a, b) => new Date(a.date_match) - new Date(b.date_match)
    );

    const firstMatch = sorted[0];
    return isMatchPronosticLocked(firstMatch);
  } catch (error) {
    console.error('Check tournament locked error:', error);
    return false;
  }
};

/**
 * Get players for a team (with optional match filter)
 */
export const getTeamPlayers = async (teamId, matchId = null) => {
  try {
    let url = `/teams/${teamId}/players`;
    if (matchId) url += `?match_id=${matchId}`;

    const response = await get(url);
    return {
      success: true,
      players: response.data || response.players || [],
    };
  } catch (error) {
    console.error('Get team players error:', error);
    return {
      success: false,
      players: [],
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get users ranking (pronostiqueurs)
 */
export const getUsersRanking = async () => {
  try {
    const response = await get('/rankings/users');
    return {
      success: true,
      ranking: response.data || response.ranking || [],
    };
  } catch (error) {
    console.error('Get users ranking error:', error);
    return {
      success: false,
      ranking: [],
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get teams ranking
 */
export const getTeamsRanking = async () => {
  try {
    const response = await get('/rankings/teams');
    return {
      success: true,
      ranking: response || response.data || [],
    };
  } catch (error) {
    console.error('Get teams ranking error:', error);
    return {
      success: false,
      ranking: [],
      error: getErrorMessage(error),
    };
  }
};