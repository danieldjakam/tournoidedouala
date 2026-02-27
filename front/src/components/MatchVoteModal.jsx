import { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import * as voteService from '@/api/voteService';

export default function MatchVoteModal({ match, isOpen, onClose, onVoteSuccess }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  if (!isOpen || !match) return null;

  const handleVoteSubmit = async () => {
    if (!selectedTeam) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une équipe gagnante',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await voteService.voteMatch(
        match.id,
        selectedTeam,
        null // Plus de vote MOTM
      );

      if (result.success) {
        toast({
          title: 'Pronostic enregistré',
          description: 'Votre vote a été validé avec succès',
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
      console.error('Vote error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Votez pour ce match</h2>
            <p className="text-blue-100 text-sm mt-1">{formatDate(match.date_match)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Match Overview */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Team 1 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full p-2 shadow">
                  <img
                    src={match.team1?.logo_url || 'https://via.placeholder.com/80'}
                    alt={match.team1?.nom}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-bold text-sm">{match.team1?.nom || 'Équipe 1'}</p>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="text-3xl font-black text-gray-300 mb-2">VS</div>
                <div className="text-xs text-gray-500 font-medium">
                  {match.statut === 'finished' ? 'Terminé' : 'À venir'}
                </div>
              </div>

              {/* Team 2 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full p-2 shadow">
                  <img
                    src={match.team2?.logo_url || 'https://via.placeholder.com/80'}
                    alt={match.team2?.nom}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-bold text-sm">{match.team2?.nom || 'Équipe 2'}</p>
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-[#023e78]" />
              Qui gagnera ce match ?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedTeam(match.team_1_id)}
                className={`p-4 rounded-xl transition-all border-2 ${
                  selectedTeam === match.team_1_id
                    ? 'border-[#023e78] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-gray-900">{match.team1?.nom}</div>
                  {selectedTeam === match.team_1_id && (
                    <div className="text-xs text-[#023e78] font-bold mt-2">✓ Sélectionné</div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedTeam(match.team_2_id)}
                className={`p-4 rounded-xl transition-all border-2 ${
                  selectedTeam === match.team_2_id
                    ? 'border-[#023e78] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-gray-900">{match.team2?.nom}</div>
                  {selectedTeam === match.team_2_id && (
                    <div className="text-xs text-[#023e78] font-bold mt-2">✓ Sélectionné</div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
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
                  <Loader size={16} className="animate-spin" />
                  Envoi...
                </>
              ) : (
                'Valider le pronostic'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
