import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import * as matchService from '@/api/matchService';
import * as adminService from '@/api/adminService';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const MatchManagement = ({ adminId }) => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    team_a_id: '',
    team_b_id: '',
    kickoff_time: '',
    match_duration_minutes: 90
  });
  const [scoreData, setScoreData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTeams(matchService.getTeams());
    setMatches(matchService.getMatches());
  };

  const handleAddMatch = (e) => {
    e.preventDefault();

    if (!formData.team_a_id || !formData.team_b_id || !formData.kickoff_time) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    const newMatch = matchService.addMatch(formData);
    adminService.logAuditAction(adminId, 'ADD_MATCH', { matchId: newMatch.id });
    
    toast({
      title: "Match ajouté",
      description: "Le match a été créé avec succès",
    });

    setFormData({
      team_a_id: '',
      team_b_id: '',
      kickoff_time: '',
      match_duration_minutes: 90
    });
    loadData();
  };

  const handleUpdateScore = (matchId) => {
    const scores = scoreData[matchId];
    if (!scores || scores.team_a === undefined || scores.team_b === undefined) {
      toast({
        title: "Scores requis",
        description: "Veuillez entrer les deux scores",
        variant: "destructive"
      });
      return;
    }

    matchService.updateMatchScore(matchId, scores.team_a, scores.team_b);
    adminService.logAuditAction(adminId, 'UPDATE_SCORE', { 
      matchId, 
      score: `${scores.team_a}-${scores.team_b}` 
    });

    toast({
      title: "Score enregistré",
      description: "Le score a été validé avec succès",
    });

    loadData();
  };

  const handleScoreChange = (matchId, team, value) => {
    setScoreData({
      ...scoreData,
      [matchId]: {
        ...scoreData[matchId],
        [team]: parseInt(value) || 0
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Ajouter un match</h3>

        <form onSubmit={handleAddMatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Équipe A</label>
              <select
                value={formData.team_a_id}
                onChange={(e) => setFormData({ ...formData, team_a_id: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              >
                <option value="">Sélectionner...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Équipe B</label>
              <select
                value={formData.team_b_id}
                onChange={(e) => setFormData({ ...formData, team_b_id: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              >
                <option value="">Sélectionner...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Date et heure (Africa/Douala)</label>
              <input
                type="datetime-local"
                value={formData.kickoff_time}
                onChange={(e) => setFormData({ ...formData, kickoff_time: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Durée (minutes)</label>
              <input
                type="number"
                value={formData.match_duration_minutes}
                onChange={(e) => setFormData({ ...formData, match_duration_minutes: parseInt(e.target.value) })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le match
          </Button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Matchs existants</h3>
        <div className="space-y-4">
          {matches.map(match => {
            const score = matchService.getMatchScore(match.id);
            return (
              <div key={match.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  <div className="text-white text-center">
                    <div className="font-semibold">{match.team_a?.name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">
                      {format(new Date(match.kickoff_time), 'dd/MM/yyyy HH:mm')}
                    </div>
                    <div className="text-gray-500 text-xs">{match.status}</div>
                  </div>
                  <div className="text-white text-center">
                    <div className="font-semibold">{match.team_b?.name}</div>
                  </div>
                </div>

                {score ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {score.team_a_score} - {score.team_b_score}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">Score validé</div>
                  </div>
                ) : (
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-gray-400 text-sm mb-1">Score {match.team_a?.name}</label>
                      <input
                        type="number"
                        min="0"
                        value={scoreData[match.id]?.team_a || ''}
                        onChange={(e) => handleScoreChange(match.id, 'team_a', e.target.value)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-400 text-sm mb-1">Score {match.team_b?.name}</label>
                      <input
                        type="number"
                        min="0"
                        value={scoreData[match.id]?.team_b || ''}
                        onChange={(e) => handleScoreChange(match.id, 'team_b', e.target.value)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateScore(match.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Valider
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchManagement;