import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Trophy,
  Lock,
  Users,
  Loader,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '../components/layout/Sidebar';
import TournamentVoteModal from '@/components/TournamentVoteModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import * as voteService from '@/api/voteService';
import * as matchService from '@/api/matchService';
import { getToken } from '@/lib/apiClient';

const VoteEquipePage = () => {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('vote-equipe');
  const [teams, setTeams] = useState([]);
  const [userTournamentVote, setUserTournamentVote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTournamentLocked, setIsTournamentLocked] = useState(false);
  const navigate = useNavigate();

  // Load teams and user's tournament vote
  useEffect(() => {
    const loadData = async () => {
      if (loading) return;

      const token = getToken();
      
      if (!currentUser || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load teams
        const teamsResult = await matchService.getTeams();
        if (teamsResult.success) {
          setTeams(teamsResult.teams || []);
        }

        // Load user's tournament vote
        const votesResult = await voteService.getUserVotes();
        if (votesResult.success) {
          setUserTournamentVote(votesResult.tournament_vote || null);
        }

        // Check if tournament voting is locked
        const locked = await matchService.isTournamentPronosticLocked();
        setIsTournamentLocked(locked);
      } catch (error) {
        console.error('Error loading data:', error);
        if (error.status === 401) {
          return; // AuthContext will handle logout
        }
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, loading, toast]);

  const handleVoteSuccess = (vote) => {
    setUserTournamentVote(vote);
    setIsModalOpen(false);
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
            Veuillez vous connecter pour voter
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
              <span className="capitalize font-medium">Vote Équipe</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#023e78] to-[#0356a8] rounded-xl shadow-lg flex items-center justify-center">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#023e78]">
                  Vainqueur du tournoi
                </h1>
                <p className="text-sm text-gray-500">
                  {userTournamentVote 
                    ? 'Votre pronostic est enregistré' 
                    : 'Votez pour l\'équipe gagnante'}
                </p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className={`mb-8 p-6 rounded-2xl border-2 ${
            isTournamentLocked 
              ? 'bg-red-50 border-red-200' 
              : userTournamentVote
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-4">
              {isTournamentLocked ? (
                <Lock size={24} className="text-red-600 mt-0.5" />
              ) : userTournamentVote ? (
                <CheckCircle size={24} className="text-green-600 mt-0.5" />
              ) : (
                <Info size={24} className="text-blue-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${
                  isTournamentLocked 
                    ? 'text-red-900' 
                    : userTournamentVote
                      ? 'text-green-900'
                      : 'text-blue-900'
                }`}>
                  {isTournamentLocked 
                    ? 'Pronostics verrouillés' 
                    : userTournamentVote
                      ? 'Pronostic enregistré'
                      : 'Pronostic unique'}
                </h3>
                <p className={`text-sm mt-2 ${
                  isTournamentLocked 
                    ? 'text-red-700' 
                    : userTournamentVote
                      ? 'text-green-700'
                      : 'text-blue-700'
                }`}>
                  {isTournamentLocked 
                    ? 'Les votes sont fermés car le premier match du tournoi a commencé.' 
                    : userTournamentVote
                      ? `Vous avez voté pour l'équipe : ${userTournamentVote.team_vote?.nom || 'Sélectionnée'}. Ce vote est définitif.`
                      : 'Vous pouvez voter pour une seule équipe. Une fois votre vote confirmé, il ne pourra plus être modifié.'}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader size={48} className="mx-auto text-[#023e78] animate-spin mb-4" />
                <p className="text-gray-600">Chargement des équipes...</p>
              </div>
            </div>
          ) : (
            /* Teams Grid */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#023e78]/10 to-[#f71a18]/10 p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-[#023e78]" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Équipes participantes</h2>
                    <p className="text-sm text-gray-600">{teams.length} équipes en compétition</p>
                  </div>
                </div>
              </div>

              {/* Teams List */}
              <div className="divide-y divide-gray-100">
                {teams.map((team) => {
                  const isUserChoice = userTournamentVote?.team_vote_id === team.id;
                  
                  return (
                    <div
                      key={team.id}
                      className={`p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                        isUserChoice ? 'bg-green-50' : ''
                      }`}
                    >
                      {/* Logo */}
                      <div className="w-16 h-16 bg-gray-50 rounded-full p-2 flex items-center justify-center flex-shrink-0">
                        <img
                          src={team.logo_url || team.logo || 'https://via.placeholder.com/64'}
                          alt={team.nom}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{team.nom}</h3>
                        <p className="text-sm text-gray-500">{team.code}</p>
                      </div>

                      {/* Status */}
                      {isUserChoice ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                          <CheckCircle size={20} />
                          <span className="text-sm">Votre choix</span>
                        </div>
                      ) : isTournamentLocked ? (
                        <Lock size={20} className="text-gray-400" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isTournamentLocked && !userTournamentVote && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#023e78] to-[#0356a8] hover:from-[#0356a8] hover:to-[#023e78] text-white px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <Trophy size={20} className="mr-2" />
                Faire mon pronostic
              </Button>
            </div>
          )}

          {/* Vote Already Made - Disabled Button */}
          {(!isTournamentLocked && userTournamentVote) && (
            <div className="mt-8 flex justify-center">
              <Button
                disabled
                className="bg-green-600 text-white px-8 py-6 text-lg font-bold shadow-lg cursor-not-allowed opacity-100"
              >
                <CheckCircle size={20} className="mr-2" />
                Pronostic déjà enregistré
              </Button>
            </div>
          )}

          {/* Tournament Locked - No Vote Made */}
          {isTournamentLocked && !userTournamentVote && (
            <div className="mt-8 flex justify-center">
              <Button
                disabled
                className="bg-red-600 text-white px-8 py-6 text-lg font-bold shadow-lg cursor-not-allowed opacity-100"
              >
                <Lock size={20} className="mr-2" />
                Votes fermés
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Vote Modal */}
      <TournamentVoteModal
        teams={teams}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVoteSuccess={handleVoteSuccess}
        existingVote={userTournamentVote ? {
          team_id: userTournamentVote.team_vote_id,
          team: userTournamentVote.team_vote
        } : null}
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

export default VoteEquipePage;
