import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Trophy,
  CheckCircle,
  Loader,
  Lock,
  X,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import * as voteService from '@/api/voteService';
import { getToken } from '@/lib/apiClient';

const PronosticPage = () => {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pronostics');
  const [userVotes, setUserVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVote, setSelectedVote] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load user votes
  useEffect(() => {
    const loadVotes = async () => {
      // Wait for auth to be initialized
      if (loading) return;
      
      // Check if user is authenticated with valid token
      const token = getToken();
      if (!currentUser || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await voteService.getUserVotes();

        if (result.success) {
          setUserVotes(result.votes || []);
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible de charger vos pronostics',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading votes:', error);
        // Handle 401 - token expired
        if (error.status === 401) {
          toast({
            title: 'Session expirée',
            description: 'Veuillez vous reconnecter',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadVotes();
  }, [currentUser, loading, toast]);

  const handleVoteClick = (vote) => {
    setSelectedVote(vote);
    setIsDetailModalOpen(true);
  };

  const handleNavigateToMatch = (matchId) => {
    setIsDetailModalOpen(false);
    navigate(`/matches/${matchId}`);
  };

  // Show loading during auth initialization
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="mx-auto text-[#023e78] animate-spin mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center px-6">
          <Lock size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Authentification requise
          </h3>
          <p className="text-gray-500 mb-6">
            Veuillez vous connecter pour voir vos pronostics
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-[#023e78] hover:bg-[#0356a8] text-white"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getVoteStatus = (vote, match) => {
    if (!match) {
      return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
    }

    if (match.statut !== 'termine') {
      return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
    }

    // Check if prediction was correct
    const correctTeam = match.score_team_1 > match.score_team_2
      ? match.team_1_id
      : match.score_team_1 < match.score_team_2
        ? match.team_2_id
        : null;

    if (vote.team_vote_id === correctTeam) {
      return { label: 'Gagnant ✓', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Perdu ✗', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] relative">
      {/* Éléments décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="flex relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 md:ml-72 p-6 lg:p-8 transition-all duration-300">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Home size={14} />
              <ChevronRight size={12} />
              <span className="capitalize font-medium">Pronostics</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#023e78] to-[#0356a8] rounded-xl shadow-lg flex items-center justify-center">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#023e78]">
                  Mes pronostics
                </h1>
                <p className="text-sm text-gray-500">
                  {userVotes.length} pronostic{userVotes.length > 1 ? 's' : ''} enregistré
                  {userVotes.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader size={48} className="mx-auto text-[#023e78] animate-spin mb-4" />
                <p className="text-gray-600">Chargement de vos pronostics...</p>
              </div>
            </div>
          ) : userVotes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
              <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Aucun pronostic pour le moment
              </h3>
              <p className="text-gray-500 mb-6">
                Allez à la page "Matchs" pour faire vos pronostics
              </p>
              <Button
                onClick={() => navigate('/matches')}
                className="bg-[#023e78] hover:bg-[#0356a8] text-white"
              >
                Voir les matchs
              </Button>
            </div>
          ) : (
            /* Votes List */
            <div className="space-y-4 animate-fadeIn">
              {userVotes.map((vote) => {
                const match = vote.match;
                const statusInfo = getVoteStatus(vote, match);

                return (
                  <div
                    key={vote.id}
                    onClick={() => handleVoteClick(vote)}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  >
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <CheckCircle size={20} className="text-[#023e78]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {match?.team1?.nom} vs {match?.team2?.nom}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {match ? formatDate(match.date_match) : 'Match non disponible'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Match Info */}
                      {match && (
                        <div className="grid grid-cols-3 gap-4 items-center mb-4 py-4 bg-gray-50 px-4 rounded-lg">
                          {/* Team 1 */}
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full p-1 flex items-center justify-center">
                              <img
                                src={match.team1?.logo_url || 'https://via.placeholder.com/48'}
                                alt={match.team1?.nom}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-2">
                              {match.team1?.nom}
                            </p>
                            {vote.team_vote_id === match.team_1_id && (
                              <div className="text-xs text-[#023e78] font-bold mt-1">
                                ✓ Votre choix
                              </div>
                            )}
                          </div>

                          {/* Score/VS */}
                          <div className="text-center">
                            {match.statut === 'termine' ? (
                              <div className="text-2xl font-black text-gray-900">
                                {match.score_team_1} - {match.score_team_2}
                              </div>
                            ) : (
                              <div className="text-xl font-black text-gray-300">VS</div>
                            )}
                          </div>

                          {/* Team 2 */}
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full p-1 flex items-center justify-center">
                              <img
                                src={match.team2?.logo_url || 'https://via.placeholder.com/48'}
                                alt={match.team2?.nom}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-2">
                              {match.team2?.nom}
                            </p>
                            {vote.team_vote_id === match.team_2_id && (
                              <div className="text-xs text-[#023e78] font-bold mt-1">
                                ✓ Votre choix
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Vote Details Summary */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Trophy size={16} className="text-[#023e78]" />
                          <span>
                            Équipe : <span className="font-bold">{vote.team_vote?.nom || 'N/A'}</span>
                          </span>
                        </div>
                        {vote.player_vote && (
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-[#f71a18]" />
                            <span className="font-bold">{vote.player_vote.prenom} {vote.player_vote.nom}</span>
                          </div>
                        )}
                      </div>

                      {/* Click hint */}
                      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">Cliquez pour voir les détails</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Vote Detail Modal */}
      {selectedVote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Détails du pronostic</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedVote.match ? formatDate(selectedVote.match.date_match) : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedVote(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Match Info */}
              {selectedVote.match && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-[#023e78]" />
                    Match
                  </h3>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Team 1 */}
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-full p-2 shadow">
                        <img
                          src={selectedVote.match.team1?.logo_url || 'https://via.placeholder.com/80'}
                          alt={selectedVote.match.team1?.nom}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-bold text-sm">{selectedVote.match.team1?.nom}</p>
                      {selectedVote.match.statut === 'termine' && (
                        <p className="text-2xl font-black text-[#023e78] mt-1">
                          {selectedVote.match.score_team_1}
                        </p>
                      )}
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      {selectedVote.match.statut === 'termine' ? (
                        <div className="text-xl font-bold text-gray-400">-</div>
                      ) : (
                        <div className="text-2xl font-black text-gray-300">VS</div>
                      )}
                      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold inline-block ${
                        selectedVote.match.statut === 'termine'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedVote.match.statut === 'termine' ? 'Terminé' : 'À venir'}
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-full p-2 shadow">
                        <img
                          src={selectedVote.match.team2?.logo_url || 'https://via.placeholder.com/80'}
                          alt={selectedVote.match.team2?.nom}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-bold text-sm">{selectedVote.match.team2?.nom}</p>
                      {selectedVote.match.statut === 'termine' && (
                        <p className="text-2xl font-black text-[#023e78] mt-1">
                          {selectedVote.match.score_team_2}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedVote.match.lieu && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{selectedVote.match.lieu}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Your Vote */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#023e78] mb-4 flex items-center gap-2">
                  <Trophy size={20} />
                  Votre pronostic
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700 font-medium">Équipe gagnante</span>
                    <span className="font-bold text-[#023e78] text-lg">
                      {selectedVote.team_vote?.nom || 'N/A'}
                    </span>
                  </div>

                  {selectedVote.player_vote && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-[#f71a18]" />
                        <span className="text-gray-700 font-medium">Homme du match</span>
                      </div>
                      <span className="font-bold text-[#f71a18]">
                        {selectedVote.player_vote.prenom} {selectedVote.player_vote.nom}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700 font-medium">Statut</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      getVoteStatus(selectedVote, selectedVote.match).color
                    }`}>
                      {getVoteStatus(selectedVote, selectedVote.match).label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700 font-medium">Date du vote</span>
                    <span className="font-medium text-gray-600">
                      {formatDate(selectedVote.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-white rounded-lg border-2 border-[#023e78]">
                    <Lock size={18} className="text-[#023e78]" />
                    <p className="text-sm text-[#023e78] font-medium">
                      Votre pronostic est verrouillé et ne peut plus être modifié
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedVote(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Fermer
                </Button>
                {selectedVote.match && (
                  <Button
                    onClick={() => handleNavigateToMatch(selectedVote.match.id)}
                    className="flex-1 bg-[#023e78] hover:bg-[#0356a8]"
                  >
                    Voir le match
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PronosticPage;
