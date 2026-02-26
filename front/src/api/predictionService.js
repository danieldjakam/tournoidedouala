import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Africa/Douala';
const MATCH_PREDICTIONS_KEY = 'match_predictions';
const TOURNAMENT_PREDICTIONS_KEY = 'tournament_predictions';

export const submitMatchPrediction = (userId, matchId, prediction) => {
  const predictions = JSON.parse(localStorage.getItem(MATCH_PREDICTIONS_KEY) || '[]');
  
  const existingIndex = predictions.findIndex(
    p => p.user_id === userId && p.match_id === matchId
  );
  
  const predictionData = {
    id: existingIndex !== -1 ? predictions[existingIndex].id : Date.now().toString(),
    user_id: userId,
    match_id: matchId,
    prediction: prediction,
    locked_at: toZonedTime(new Date(), TIMEZONE).toISOString()
  };
  
  if (existingIndex !== -1) {
    predictions[existingIndex] = predictionData;
  } else {
    predictions.push(predictionData);
  }
  
  localStorage.setItem(MATCH_PREDICTIONS_KEY, JSON.stringify(predictions));
  return predictionData;
};

export const submitTournamentPrediction = (userId, teamId) => {
  const predictions = JSON.parse(localStorage.getItem(TOURNAMENT_PREDICTIONS_KEY) || '[]');
  
  const existingIndex = predictions.findIndex(p => p.user_id === userId);
  
  const predictionData = {
    id: existingIndex !== -1 ? predictions[existingIndex].id : Date.now().toString(),
    user_id: userId,
    team_id: teamId,
    locked_at: toZonedTime(new Date(), TIMEZONE).toISOString()
  };
  
  if (existingIndex !== -1) {
    predictions[existingIndex] = predictionData;
  } else {
    predictions.push(predictionData);
  }
  
  localStorage.setItem(TOURNAMENT_PREDICTIONS_KEY, JSON.stringify(predictions));
  return predictionData;
};

export const getUserMatchPrediction = (userId, matchId) => {
  const predictions = JSON.parse(localStorage.getItem(MATCH_PREDICTIONS_KEY) || '[]');
  return predictions.find(p => p.user_id === userId && p.match_id === matchId);
};

export const getUserTournamentPrediction = (userId) => {
  const predictions = JSON.parse(localStorage.getItem(TOURNAMENT_PREDICTIONS_KEY) || '[]');
  return predictions.find(p => p.user_id === userId);
};

export const calculateLeaderboard = () => {
  const users = JSON.parse(localStorage.getItem('tournament_users') || '[]');
  const matchPredictions = JSON.parse(localStorage.getItem(MATCH_PREDICTIONS_KEY) || '[]');
  const tournamentPredictions = JSON.parse(localStorage.getItem(TOURNAMENT_PREDICTIONS_KEY) || '[]');
  const scores = JSON.parse(localStorage.getItem('match_scores') || '[]');
  
  const leaderboard = users.map(user => {
    let points = 0;
    
    matchPredictions
      .filter(p => p.user_id === user.id)
      .forEach(prediction => {
        const score = scores.find(s => s.match_id === prediction.match_id);
        if (score) {
          const actualResult = score.team_a_score > score.team_b_score ? 'team_a' :
                              score.team_b_score > score.team_a_score ? 'team_b' : 'draw';
          if (prediction.prediction === actualResult) {
            points += 3;
          }
        }
      });
    
    const hasTournamentPrediction = tournamentPredictions.some(p => p.user_id === user.id);
    
    return {
      userId: user.id,
      name: `${user.firstname} ${user.name}`,
      points,
      matchPredictions: matchPredictions.filter(p => p.user_id === user.id).length,
      hasTournamentPrediction
    };
  });
  
  return leaderboard.sort((a, b) => b.points - a.points);
};