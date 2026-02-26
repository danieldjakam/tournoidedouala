import React, { useState, useEffect } from 'react';
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import * as matchService from '@/api/matchService';
import * as adminService from '@/api/adminService';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VotingSection = ({ match, userId }) => {
  const [votingStatus, setVotingStatus] = useState({ isOpen: false });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [existingVote, setExistingVote] = useState(null);
  const [players, setPlayers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (match) {
      const status = matchService.getMotmVotingStatus(match);
      setVotingStatus(status);

      // Get players from both teams
      const teamAPlayers = (match.team_a?.players_json || []).map(p => ({ 
        id: `a_${p}`, 
        name: p, 
        team: match.team_a.name,
        teamLogo: match.team_a.logo_url
      }));
      const teamBPlayers = (match.team_b?.players_json || []).map(p => ({ 
        id: `b_${p}`, 
        name: p, 
        team: match.team_b.name,
        teamLogo: match.team_b.logo_url
      }));
      setPlayers([...teamAPlayers, ...teamBPlayers]);

      // Check for existing vote
      const vote = adminService.getUserVote(userId, match.id);
      setExistingVote(vote);
      if (vote) {
        setSelectedPlayer(vote.player_id);
      }
    }
  }, [match, userId]);

  const handleSubmitVote = () => {
    if (!selectedPlayer) {
      toast({
        title: "Sélectionnez un joueur",
        description: "Veuillez choisir le meilleur joueur du match",
        variant: "destructive"
      });
      return;
    }

    if (!votingStatus.isOpen) {
      toast({
        title: "Vote fermé",
        description: "La période de vote est terminée",
        variant: "destructive"
      });
      return;
    }

    adminService.submitMotmVote(userId, match.id, selectedPlayer);
    
    toast({
      title: existingVote ? "Vote mis à jour !" : "Vote enregistré !",
      description: "Votre vote pour le meilleur joueur a été sauvegardé",
    });

    setExistingVote({ player_id: selectedPlayer });
  };

  if (!match) return null;

  if (!votingStatus.isOpen) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-primary-blue">
          <Star className="w-6 h-6 fill-current" />
          <h3 className="text-xl font-bold">Vote Homme du Match</h3>
        </div>

        <div className="py-8 bg-gray-50 rounded-lg border border-gray-100">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {votingStatus.opensAt && new Date(votingStatus.opensAt) > new Date() ? (
              <>
                Le vote ouvre{' '}
                <span className="text-primary-blue">
                  {formatDistanceToNow(new Date(votingStatus.opensAt), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </>
            ) : (
              'Le vote est fermé pour ce match'
            )}
          </p>
          {votingStatus.opensAt && (
            <p className="text-gray-400 text-sm mt-2">
              {format(new Date(votingStatus.opensAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Vote Homme du Match</h3>
        </div>
        {existingVote && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <CheckCircle className="w-4 h-4" />
            VOTE ENREGISTRÉ
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-6 border-l-4 border-primary-blue pl-4">
        Sélectionnez le joueur qui a le plus brillé durant cette rencontre.
      </p>

      {players.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          Aucun joueur disponible pour le vote (Compositions non publiées)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-96 overflow-y-auto p-1">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                selectedPlayer === player.id
                  ? 'border-primary-blue bg-blue-50 shadow-md ring-1 ring-primary-blue'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 p-1 flex-shrink-0 border border-gray-200">
                <img src={player.teamLogo} alt="" className="w-full h-full object-contain opacity-80" />
              </div>
              <div className="min-w-0">
                <div className={`font-bold truncate ${selectedPlayer === player.id ? 'text-primary-blue' : 'text-gray-900'}`}>
                  {player.name}
                </div>
                <div className="text-gray-500 text-xs truncate uppercase tracking-wider">{player.team}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Button
        onClick={handleSubmitVote}
        disabled={!selectedPlayer}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-6 text-lg font-bold disabled:opacity-50 disabled:bg-gray-300"
      >
        <Star className="w-5 h-5 mr-2 fill-white" />
        {existingVote ? 'METTRE À JOUR MON VOTE' : 'SOUMETTRE MON VOTE'}
      </Button>

      <p className="text-gray-400 text-xs text-center mt-4">
        Fermeture du vote{' '}
        {formatDistanceToNow(new Date(votingStatus.closesAt), { 
          addSuffix: true, 
          locale: fr 
        })}
      </p>
    </div>
  );
};

export default VotingSection;