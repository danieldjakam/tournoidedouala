import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronRight,
  Home,
  Filter,
  Loader,
  Clock,
  Trophy,
  Lock,
  ChevronRight as ChevronRightIcon,
  CheckCircle,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import MatchVoteModal from '../components/MatchVoteModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import * as matchService from '@/api/matchService';

const MatchsPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [votedMatchIds, setVotedMatchIds] = useState(new Set());
  const navigate = useNavigate();

  // Load matches and teams
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load matches based on filter
        let matchesResult;
        if (statusFilter === 'all') {
          matchesResult = await matchService.getMatches({});
        } else if (statusFilter === 'planifie') {
          matchesResult = await matchService.getUpcomingMatches();
        } else if (statusFilter === 'en_cours') {
          matchesResult = await matchService.getLiveMatches();
        } else if (statusFilter === 'termine') {
          matchesResult = await matchService.getFinishedMatches();
        } else {
          matchesResult = await matchService.getMatches({ status: statusFilter });
        }

        if (matchesResult.success) {
          const matches = matchesResult.matches || [];
          setMatches(matches);

          // Load user votes for these matches if logged in
          if (currentUser && matches.length > 0) {
            const votedIds = await loadUserVotes(matches);
            setVotedMatchIds(votedIds);
          }
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les matchs',
            variant: 'destructive',
          });
        }

        // Load teams
        const teamsResult = await matchService.getTeams();
        if (teamsResult.success) {
          setTeams(teamsResult.teams);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [statusFilter, toast, currentUser]);

  // Load user votes for a list of matches
  const loadUserVotes = async (matches) => {
    const votedIds = new Set();
    
    try {
      // Check votes for all matches in parallel
      const votePromises = matches.map(async (match) => {
        try {
          const result = await matchService.getMyVoteForMatch(match.id);
          if (result.success && result.hasVoted) {
            votedIds.add(match.id);
          }
        } catch (error) {
          console.error(`Error checking vote for match ${match.id}:`, error);
        }
      });

      await Promise.all(votePromises);
    } catch (error) {
      console.error('Error loading user votes:', error);
    }

    return votedIds;
  };

  const handleMatchClick = (match) => {
    navigate(`/matches/${match.id}`);
  };

  const handleVoteClick = (match, e) => {
    e.stopPropagation(); // Prevent triggering the card click

    if (!currentUser) {
      toast({
        title: 'Authentification requise',
        description: 'Veuillez vous connecter pour voter',
        variant: 'destructive',
      });
      return;
    }

    if (!matchService.canUserVote(match, false)) {
      toast({
        title: 'Vote fermé',
        description: 'Les votes sont fermés pour ce match',
        variant: 'destructive',
      });
      return;
    }

    setSelectedMatch(match);
    setIsVoteModalOpen(true);
  };

  const handleVoteSuccess = (vote) => {
    toast({
      title: 'Succès',
      description: 'Votre pronostic a été enregistré',
    });
    // Add this match to voted IDs
    setVotedMatchIds(prev => new Set(prev).add(vote.match_id));
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusBadge = (statut) => {
    const badges = {
      planifie: { label: 'À venir', color: 'bg-blue-100 text-blue-800' },
      en_cours: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
      termine: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
    };
    return badges[statut] || { label: statut, color: 'bg-gray-100 text-gray-800' };
  };

  if (!currentUser) return null;

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
              <span className="capitalize font-medium">Matchs</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#023e78] to-[#0356a8] rounded-xl shadow-lg flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#023e78]">Tous les matchs</h1>
                  <p className="text-sm text-gray-500">
                    {matches.length} match{matches.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition bg-white"
                >
                  <option value="all">Tous</option>
                  <option value="planifie">À venir</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminés</option>
                </select>
              </div>
            </div>
          </div>

          {/* Matches Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader size={48} className="mx-auto text-[#023e78] animate-spin mb-4" />
                <p className="text-gray-600">Chargement des matchs...</p>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Aucun match pour le moment
              </h3>
              <p className="text-gray-500">
                Les prochains matchs apparaîtront ici dès qu'ils seront programmés.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              {matches.map((match) => {
                const isLocked = matchService.isMatchPronosticLocked(match);
                const statusBadge = getStatusBadge(match.statut);
                const hasVoted = votedMatchIds.has(match.id);

                return (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl cursor-pointer relative ${
                      hasVoted ? 'ring-2 ring-green-500' : ''
                    } ${
                      isLocked ? 'opacity-90' : ''
                    }`}
                  >
                    {/* Voted Badge */}
                    {hasVoted && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                        <CheckCircle size={14} />
                        Déjà voté
                      </div>
                    )}

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#023e78]/10 to-[#f71a18]/10 p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span className="font-medium">{formatDate(match.date_match)}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    {/* Match Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4 items-center mb-4">
                        {/* Team 1 */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-full p-2 flex items-center justify-center">
                            <img
                              src={match.team1?.logo_url || 'https://via.placeholder.com/80'}
                              alt={match.team1?.nom}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-bold text-sm text-gray-900 line-clamp-2">
                            {match.team1?.nom}
                          </p>
                        </div>

                        {/* VS / Score */}
                        <div className="text-center">
                          {match.statut === 'termine' ? (
                            <div className="text-xl font-black text-gray-900">
                              {match.score_team_1} - {match.score_team_2}
                            </div>
                          ) : (
                            <div className="text-2xl font-black text-gray-300 mb-2">VS</div>
                          )}
                        </div>

                        {/* Team 2 */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-full p-2 flex items-center justify-center">
                            <img
                              src={match.team2?.logo_url || 'https://via.placeholder.com/80'}
                              alt={match.team2?.nom}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-bold text-sm text-gray-900 line-clamp-2">
                            {match.team2?.nom}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchClick(match);
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                        >
                          <span>Détails</span>
                          <ChevronRightIcon size={16} />
                        </button>

                        {match.statut === 'planifie' && (
                          <button
                            onClick={(e) => handleVoteClick(match, e)}
                            disabled={hasVoted}
                            className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                              hasVoted
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#023e78] to-[#0356a8] hover:from-[#0356a8] hover:to-[#023e78] text-white'
                            }`}
                          >
                            {hasVoted ? (
                              <>
                                <CheckCircle size={16} />
                                Voté
                              </>
                            ) : (
                              <>
                                <Trophy size={16} />
                                Voter
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal de vote */}
      <MatchVoteModal
        match={selectedMatch}
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onVoteSuccess={handleVoteSuccess}
      />

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

export default MatchsPage;