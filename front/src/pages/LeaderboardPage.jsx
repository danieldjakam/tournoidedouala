import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { ChevronRight, Trophy, Users, TrendingUp, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import * as matchService from '@/api/matchService';
import { getToken } from '@/lib/apiClient';

const LeaderboardPage = () => {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboardType, setLeaderboardType] = useState('users'); // 'users' ou 'teams'
  const [usersRanking, setUsersRanking] = useState([]);
  const [teamsRanking, setTeamsRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRankings = async () => {
      // Wait for auth to be initialized
      if (loading) return;

      try {
        setIsLoading(true);

        // Charger les deux classements en parallèle
        // Ces API sont publiques mais on vérifie quand même
        const [usersResult, teamsResult] = await Promise.all([
          matchService.getUsersRanking(),
          matchService.getTeamsRanking(),
        ]);

        if (usersResult.success) {
          setUsersRanking(usersResult.ranking || []);
        }

        if (teamsResult.success) {
          setTeamsRanking(teamsResult.ranking || []);
        }
      } catch (error) {
        console.error('Error loading rankings:', error);
        
        // Handle 401 - might happen if middleware requires auth
        if (error.status === 401) {
          toast({
            title: 'Session expirée',
            description: 'Veuillez vous reconnecter',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les classements',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRankings();
  }, [loading, toast]);

  // Show loading during auth initialization
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#023e78] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            Veuillez vous connecter pour voir les classements
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
      {/* Background décoratif */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenu principal */}
        <main className="flex-1 md:ml-72 p-6 lg:p-8 transition-all duration-300">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Trophy size={14} />
              <ChevronRight size={12} />
              <span className="capitalize font-medium">Classements</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#023e78] to-[#0356a8] rounded-xl shadow-lg flex items-center justify-center">
                  <Trophy size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#023e78]">
                    Classements
                  </h1>
                  <p className="text-sm text-gray-500">
                    Suivez les meilleurs pronostiqueurs et équipes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setLeaderboardType('users')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                leaderboardType === 'users'
                  ? 'bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Users size={20} />
              <span>Pronostiqueurs</span>
            </button>
            <button
              onClick={() => setLeaderboardType('teams')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                leaderboardType === 'teams'
                  ? 'bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <TrendingUp size={20} />
              <span>Équipes</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#023e78] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des classements...</p>
              </div>
            </div>
          ) : leaderboardType === 'users' ? (
            /* Classement Pronostiqueurs */
            <UsersRanking ranking={usersRanking} />
          ) : (
            /* Classement Équipes */
            <TeamsRanking ranking={teamsRanking} />
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

/* Composant pour le classement des pronostiqueurs */
const UsersRanking = ({ ranking }) => {
  const getRankBadge = (index) => {
    if (index === 0) return { bg: 'bg-yellow-400', text: 'text-yellow-700', icon: '🥇' };
    if (index === 1) return { bg: 'bg-gray-400', text: 'text-gray-700', icon: '🥈' };
    if (index === 2) return { bg: 'bg-orange-400', text: 'text-orange-700', icon: '🥉' };
    return null;
  };

  if (ranking.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Aucun classement disponible
        </h3>
        <p className="text-gray-500">
          Les classements apparaîtront une fois que les utilisateurs auront fait des pronostics
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#023e78]/10 to-[#f71a18]/10 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-[#023e78]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Classement des Pronostiqueurs</h2>
            <p className="text-sm text-gray-600">{ranking.length} participants</p>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-600">
        <div className="col-span-2 text-center">Rang</div>
        <div className="col-span-5">Joueur</div>
        <div className="col-span-3 text-center flex items-center justify-center">Points</div>
        {/* <div className="col-span-2 text-center">Votes</div> */}
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-gray-100">
        {ranking.map((user, index) => {
          const badge = getRankBadge(index);
          return (
            <div
              key={user.id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors ${
                badge ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''
              }`}
            >
              {/* Rang */}
              <div className="col-span-2 text-center">
                {badge ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : (
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                )}
              </div>

              {/* Joueur */}
              <div className="col-span-7">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    badge ? badge.bg : 'bg-gray-300'
                  }`}>
                    {user.prenom?.charAt(0) || user.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {user.prenom} {user.nom}
                    </p>
                    <p className="text-xs text-gray-500">{user.telephone}</p>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="col-span-3 ">
                <span className={`text-xl font-black ${
                  index < 3 ? 'text-[#023e78]' : 'text-gray-700'
                }`}>
                  {user.points || 0}
                </span>
                <p className="text-xs text-gray-500">pts</p>
              </div>

              {/* Votes */}
              {/* <div className="col-span-2 text-center">
                <span className="text-sm font-medium text-gray-600">
                  {user.match_votes || 0}
                </span>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* Composant pour le classement des équipes */
const TeamsRanking = ({ ranking }) => {
  const getRankBadge = (index) => {
    if (index === 0) return { bg: 'bg-yellow-400', text: 'text-yellow-700', icon: '🥇' };
    if (index === 1) return { bg: 'bg-gray-400', text: 'text-gray-700', icon: '🥈' };
    if (index === 2) return { bg: 'bg-orange-400', text: 'text-orange-700', icon: '🥉' };
    return null;
  };

  if (ranking.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Aucun classement disponible
        </h3>
        <p className="text-gray-500">
          Les classements apparaîtront une fois que les équipes auront des points
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#023e78]/10 to-[#f71a18]/10 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-[#023e78]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Classement des Équipes</h2>
            <p className="text-sm text-gray-600">{ranking.length} équipes</p>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-600">
        <div className="col-span-2 text-center">Rang</div>
        <div className="col-span-7">Équipe</div>
        <div className="col-span-3 text-center">Points</div>
        {/* <div className="col-span-2 text-center">Priorité</div> */}
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-gray-100">
        {ranking.map((team, index) => {
          const badge = getRankBadge(index);
          return (
            <div
              key={team.id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors ${
                badge ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''
              }`}
            >
              {/* Rang */}
              <div className="col-span-2 text-center">
                {badge ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : (
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                )}
              </div>

              {/* Équipe */}
              <div className="col-span-7">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full p-2 flex items-center justify-center">
                    <img
                      src={team.logo || team.logo_url || 'https://via.placeholder.com/48'}
                      alt={team.nom}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{team.nom}</p>
                    <p className="text-xs text-gray-500">{team.code}</p>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="col-span-3 text-center">
                <span className={`text-xl font-black ${
                  index < 3 ? 'text-[#023e78]' : 'text-gray-700'
                }`}>
                  {team.total_points || team.points || 0}
                </span>
                <p className="text-xs text-gray-500">pts</p>
              </div>

              {/* Priorité */}
              {/* <div className="col-span-2 text-center">
                <span className="text-sm font-medium text-gray-600">
                  {team.priorite || 0}
                </span>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
