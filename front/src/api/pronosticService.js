import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Africa/Douala';
const MATCH_PRONOSTICS_KEY = 'match_pronostics';
const TOURNAMENT_PRONOSTICS_KEY = 'tournament_pronostics';

export const submitMatchPronostic = (userId, matchId, pronostic) => {
  const pronostics = JSON.parse(localStorage.getItem(MATCH_PRONOSTICS_KEY) || '[]');
  
  const existingIndex = pronostics.findIndex(
    p => p.user_id === userId && p.match_id === matchId
  );
  
  const pronosticData = {
    id: existingIndex !== -1 ? pronostics[existingIndex].id : Date.now().toString(),
    user_id: userId,
    match_id: matchId,
    pronostic: pronostic,
    locked_at: toZonedTime(new Date(), TIMEZONE).toISOString()
  };
  
  if (existingIndex !== -1) {
    pronostics[existingIndex] = pronosticData;
  } else {
    pronostics.push(pronosticData);
  }
  
  localStorage.setItem(MATCH_PRONOSTICS_KEY, JSON.stringify(pronostics));
  return pronosticData;
};

export const submitTournamentPronostic = (userId, teamId) => {
  const pronostics = JSON.parse(localStorage.getItem(TOURNAMENT_PRONOSTICS_KEY) || '[]');
  
  const existingIndex = pronostics.findIndex(p => p.user_id === userId);
  
  const pronosticData = {
    id: existingIndex !== -1 ? pronostics[existingIndex].id : Date.now().toString(),
    user_id: userId,
    team_id: teamId,
    locked_at: toZonedTime(new Date(), TIMEZONE).toISOString()
  };
  
  if (existingIndex !== -1) {
    pronostics[existingIndex] = pronosticData;
  } else {
    pronostics.push(pronosticData);
  }
  
  localStorage.setItem(TOURNAMENT_PRONOSTICS_KEY, JSON.stringify(pronostics));
  return pronosticData;
};

export const getUserMatchPronostic = (userId, matchId) => {
  const pronostics = JSON.parse(localStorage.getItem(MATCH_PRONOSTICS_KEY) || '[]');
  return pronostics.find(p => p.user_id === userId && p.match_id === matchId);
};

export const getUserTournamentPronostic = (userId) => {
  const pronostics = JSON.parse(localStorage.getItem(TOURNAMENT_PRONOSTICS_KEY) || '[]');
  return pronostics.find(p => p.user_id === userId);
};

export const calculateLeaderboard = () => {
  const users = JSON.parse(localStorage.getItem('tournament_users') || '[]');
  const matchPronostics = JSON.parse(localStorage.getItem(MATCH_PRONOSTICS_KEY) || '[]');
  const tournamentPronostics = JSON.parse(localStorage.getItem(TOURNAMENT_PRONOSTICS_KEY) || '[]');
  const scores = JSON.parse(localStorage.getItem('match_scores') || '[]');
  
  const leaderboard = users.map(user => {
    let points = 0;
    
    matchPronostics
      .filter(p => p.user_id === user.id)
      .forEach(prediction => {
        const score = scores.find(s => s.match_id === prediction.match_id);
        if (score) {
          const actualResult = score.team_a_score > score.team_b_score ? 'team_a' :
                              score.team_b_score > score.team_a_score ? 'team_b' : 'draw';
          if (prediction.pronostic === actualResult) {
            points += 3;
          }
        }
      });
    
    const hasTournamentPronostic = tournamentPronostics.some(p => p.user_id === user.id);
    
    return {
      userId: user.id,
      name: `${user.firstname} ${user.name}`,
      points,
      matchPronostics: matchPronostics.filter(p => p.user_id === user.id).length,
      hasTournamentPronostic
    };
  });
  
  return leaderboard;
  // return leaderboard.sort((a, b) => b.points - a.points);
};