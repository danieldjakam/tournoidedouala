import { useState, useEffect } from 'react';
import { X, Trophy, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import * as voteService from '@/api/voteService';
import * as matchService from '@/api/matchService';
import { Loader } from 'lucide-react';

export default function TournamentVoteModal({ teams, isOpen, onClose, onVoteSuccess, existingVote }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (existingVote) {
      setSelectedTeam(existingVote.team_id);
    }
    
    // Check if tournament voting is locked
    const checkLock = async () => {
      const locked = await matchService.isTournamentPronosticLocked();
      setIsLocked(locked);
    };
    checkLock();
  }, [existingVote]);

  if (!isOpen) return null;

  const handleVoteSubmit = async () => {
    if (!selectedTeam) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une équipe',
        variant: 'destructive',
      });
      return;
    }

    if (isLocked) {
      toast({
        title: 'Vote fermé',
        description: 'Les pronostics pour le vainqueur du tournoi sont fermés',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await voteService.voteTournament(selectedTeam);

      if (result.success) {
        toast({
          title: 'Pronostic enregistré',
          description: 'Votre pronostic pour le vainqueur du tournoi a été validé',
        });
        onVoteSuccess(result.vote);
        onClose();
        setSelectedTeam(null);
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Impossible d\'enregistrer le vote',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Tournament vote error:', error);
      toast({
        title: 'Erreur',
        description: error.status === 401 ? 'Session expirée. Veuillez vous reconnecter.' : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Vainqueur du tournoi</h2>
            <p className="text-blue-100 text-sm mt-1">
              {existingVote ? 'Votre pronostic est déjà enregistré' : 'Quelle équipe remportera le tournoi ?'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className={`p-4 rounded-xl border-2 ${
            isLocked || existingVote
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              {isLocked || existingVote ? (
                <CheckCircle size={20} className="text-green-600 mt-0.5" />
              ) : (
                <Trophy size={20} className="text-blue-600 mt-0.5" />
              )}
              <div>
                <h3 className={`font-bold ${isLocked || existingVote ? 'text-green-900' : 'text-blue-900'}`}>
                  {isLocked || existingVote ? 'Pronostic enregistré' : 'Pronostic unique'}
                </h3>
                <p className={`text-sm mt-1 ${isLocked || existingVote ? 'text-green-700' : 'text-blue-700'}`}>
                  {existingVote
                    ? `Vous avez voté pour ${existingVote.team?.nom || 'cette équipe'}. Ce vote est définitif.`
                    : isLocked
                      ? 'Les pronostics sont fermés car le premier match a commencé.'
                      : 'Vous ne pouvez voter qu\'une seule fois pour l\'équipe vainqueur du tournoi. Ce vote est définitif.'}
                </p>
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-[#023e78]" />
              {existingVote ? 'Votre choix' : 'Sélectionnez l\'équipe gagnante'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {teams.map((team) => {
                const isUserChoice = existingVote?.team_id === team.id;
                
                return (
                  <div
                    key={team.id}
                    className={`p-4 rounded-xl transition-all border-2 ${
                      isUserChoice
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-offset-2'
                        : existingVote
                          ? 'border-gray-200 opacity-50'
                          : selectedTeam === team.id
                            ? 'border-[#023e78] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                    } ${existingVote && !isUserChoice ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full p-2 shadow">
                        <img
                          src={team.logo_url || team.logo || 'https://via.placeholder.com/64'}
                          alt={team.nom}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="font-bold text-gray-900 text-sm">{team.nom}</div>
                      <div className="text-xs text-gray-500 mt-1">{team.code}</div>
                      {isUserChoice && (
                        <div className="text-xs text-green-700 font-bold mt-2 flex items-center justify-center gap-1">
                          <CheckCircle size={14} />
                          Votre choix
                        </div>
                      )}
                      {selectedTeam === team.id && !existingVote && (
                        <div className="text-xs text-[#023e78] font-bold mt-2 flex items-center justify-center gap-1">
                          <Trophy size={14} />
                          Sélectionné
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          {!existingVote && !isLocked && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-bold transition"
              >
                Annuler
              </button>
              <button
                onClick={handleVoteSubmit}
                disabled={!selectedTeam || isLoading}
                className="flex-1 px-4 py-3 bg-[#023e78] hover:bg-[#0356a8] text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Trophy size={18} />
                    Valider le pronostic
                  </>
                )}
              </button>
            </div>
          )}

          {/* Close button when vote already made or locked */}
          {(existingVote || isLocked) && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-[#023e78] hover:bg-[#0356a8] text-white rounded-lg font-bold transition"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
