import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Trophy,
  CheckCircle,
  Loader,
  Lock,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import * as voteService from '@/api/voteService';

const PronosticPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pronostics');
  const [userVotes, setUserVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user votes
  useEffect(() => {
    const loadVotes = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const result = await voteService.getUserVotes();

        if (result.success) {
          setUserVotes(result.votes);
        }
      } catch (error) {
        console.error('Error loading votes:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos pronostics',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVotes();
  }, [currentUser, toast]);

  if (!currentUser) return null;

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getVoteStatus = (vote, match) => {
    if (match.statut !== 'finished') {
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
              <a
                href="/matches"
                className="inline-block px-6 py-3 bg-[#023e78] text-white rounded-lg font-bold hover:bg-[#0356a8] transition"
              >
                Voir les matchs
              </a>
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
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            {formatDate(match.date_match)}
                          </p>
                          <div className="flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" />
                            <h3 className="text-lg font-bold text-gray-900">
                              Pronostic enregistré
                            </h3>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Match Info */}
                      <div className="grid grid-cols-3 gap-4 items-center mb-6 py-4 bg-gray-50 px-4 rounded-lg">
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
                          {match.statut === 'finished' ? (
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

                      {/* Vote Details */}
                      <div className="space-y-2 text-sm">
                        {vote.player_vote_id && vote.playerVote && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Trophy size={16} className="text-[#023e78]" />
                            <span>
                              Homme du match : <span className="font-bold">{vote.playerVote.prenom} {vote.playerVote.nom}</span>
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Lock size={16} />
                          <span>
                            Validé le {formatDate(vote.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

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
