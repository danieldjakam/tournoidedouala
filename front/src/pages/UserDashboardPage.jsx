import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as matchService from '@/api/matchService';
import * as voteService from '@/api/voteService';
import { 
  Menu, Award, Calendar, TrendingUp, Star, 
  Trophy, Target, Users, ChevronRight, Play,
  Clock, MapPin, Shield, Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import Sidebar from "../components/layout/Sidebar";
import TopUser from "../components/DashboardUser/TopUser";

const UserDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    pronosticsCount: 0,
    weeklyPoints: 0,
    lastWeekPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Charger les données depuis le backend
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const matchesResult = await matchService.getMatches();
        if (matchesResult.success) {
          const allMatches = matchesResult.matches || [];
          setMatches(allMatches);
          setLiveMatches(allMatches.filter(m => m.status === 'live'));
          setUpcomingMatches(
            allMatches
              .filter(m => m.status === 'upcoming')
              .sort((a, b) => new Date(a.kickoff_time) - new Date(b.kickoff_time))
              .slice(0, 3)
          );
        }

        const teamsResult = await matchService.getTeams();
        if (teamsResult.success) {
          setTeams(teamsResult.teams || []);
        }

        const rankingResult = await matchService.getUsersRanking();
        if (rankingResult.success) {
          setLeaderboard(rankingResult.ranking || []);
        }

        const votesResult = await voteService.getUserVotes();
        if (votesResult.success) {
          const userPronosticsCount = (votesResult.votes || []).length;
          setUserStats(prev => ({ ...prev, pronosticsCount: userPronosticsCount }));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || leaderboard.length === 0) return;
    const currentUserData = leaderboard.find(user => user.id === currentUser.id);
    if (currentUserData) {
      setUserStats(prev => ({
        ...prev,
        totalPoints: currentUserData.points || 0,
      }));
    }
  }, [currentUser, leaderboard]);

  const currentUserRank = leaderboard.findIndex(user => user.id === currentUser?.id) + 1;
  const currentUserLeaderboard = leaderboard.find(user => user.id === currentUser?.id);
  const weeklyDifference = userStats.weeklyPoints - userStats.lastWeekPoints;
  const weeklyTrend = weeklyDifference > 0 ? '↑' : weeklyDifference < 0 ? '↓' : '→';
  const trendColor = weeklyDifference > 0 ? 'text-green-500' : weeklyDifference < 0 ? 'text-red-500' : 'text-gray-500';

  const mapLeaderboardUser = (user, index) => ({
    userId: user.id,
    name: `${user.prenom || user.firstname || ''} ${user.nom || user.name || ''}`.trim() || 'Utilisateur',
    points: user.points || 0,
    rank: index + 1
  });

  const mappedLeaderboard = leaderboard.map(mapLeaderboardUser);

  const formatMatchDate = (kickoffTime) => {
    const date = new Date(kickoffTime);
    const now = new Date();
    const diffHours = Math.floor((date - now) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((date - now) / (1000 * 60));
      return `Dans ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Dans ${diffHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const isMobile = windowWidth < 768;

  if (!currentUser) return null;

  // Stats cards data
  const statsCards = [
    {
      title: "Points Totaux",
      value: userStats.totalPoints,
      icon: Trophy,
      color: "from-[#023e78] to-[#023e78]/80",
      bgColor: "bg-white"
    },
    {
      title: "Pronostics",
      value: userStats.pronosticsCount,
      icon: Target,
      color: "from-[#f71a18] to-[#f71a18]/80",
      bgColor: "bg-white"
    },
    {
      title: "Cette Semaine",
      value: userStats.weeklyPoints,
      icon: TrendingUp,
      color: "from-[#023e78]/70 to-[#023e78]/50",
      bgColor: "bg-white",
      trend: weeklyDifference !== 0 ? `${weeklyTrend} ${Math.abs(weeklyDifference)}` : null,
      trendColor: trendColor
    },
    {
      title: "Classement",
      value: currentUserRank > 0 ? `#${currentUserRank}` : '-',
      icon: Award,
      color: "from-[#f71a18]/80 to-[#f71a18]/60",
      bgColor: "bg-white"
    }
  ];

  // Quick actions
  const quickActions = [
    { title: "Matchs", icon: Calendar, href: "/matches", color: "bg-[#023e78]" },
    { title: "Pronostics", icon: Target, href: "/pronostics", color: "bg-[#f71a18]" },
    { title: "Vote Équipe", icon: Users, href: "/vote-equipe", color: "bg-[#023e78]/80" },
    { title: "Classement", icon: Trophy, href: "/leaderboard", color: "bg-[#f71a18]/80" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-200 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                  <img
                    src="https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Tournoi 2026</h1>
                  <p className="text-xs text-gray-500">{currentUser.pseudo || `${currentUser.firstname} ${currentUser.name}`}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        ${!isMobile ? 'ml-72' : ''}
        ${isMobile ? 'pt-20 pb-24' : 'pb-8'}
      `}>
        {/* Welcome Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-gradient-to-r from-[#023e78] via-[#023e78] to-[#023e78] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Bon retour,</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                    {currentUser.firstname || currentUser.pseudo || 'Utilisateur'}
                  </h1>
                  <p className="text-blue-100 mt-2 text-sm">
                    Prêt à faire de nouveaux pronostics ?
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all p-3 rounded-2xl border border-white/20"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#023e78] to-red-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {currentUser.firstname?.charAt(0) || currentUser.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-white font-semibold text-sm">Voir mon profil</p>
                    <p className="text-blue-200 text-xs">Gérer mes informations</p>
                  </div>
                  <ChevronRight className="text-white w-5 h-5 hidden sm:block" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {statsCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-4 border border-white/20`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-lg`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <p className="text-gray-600 text-xs font-medium">{stat.title}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        {stat.trend && (
                          <span className={`text-xs font-bold ${stat.trendColor}`}>
                            {stat.trend}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-6 lg:px-8 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Actions Rapides
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-2xl p-4 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">{action.title}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Matches Section */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {liveMatches.length > 0 && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </>
                )}
              </span>
              Matchs en Direct
            </h2>
            {liveMatches.length > 0 && (
              <Link to="/matches" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                Voir tout <ChevronRight size={16} />
              </Link>
            )}
          </div>

          {liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {liveMatches.slice(0, 2).map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="group bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                    <Clock size={16} className="text-red-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                        {match.team_a?.logo_url ? (
                          <img src={match.team_a.logo_url} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-white font-bold">A</span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-800">{match.team_a?.name || 'Équipe A'}</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">VS</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">{match.team_b?.name || 'Équipe B'}</span>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md">
                        {match.team_b?.logo_url ? (
                          <img src={match.team_b.logo_url} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-white font-bold">B</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-[#f71a18]" />
              </div>
              <p className="text-[#f71a18] font-medium font-bold">Aucun match en direct pour le moment</p>
              <p className="text-[#023e78] text-sm mt-1">Revenez plus tard pour suivre les rencontres</p>
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                Prochains Matchs
              </h2>
              <Link to="/matches" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                Voir tout <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-2xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Calendar size={14} />
                      {formatMatchDate(match.kickoff_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        {match.team_a?.logo_url ? (
                          <img src={match.team_a.logo_url} alt="" className="w-5 h-5 object-contain" />
                        ) : (
                          <span className="text-white text-xs font-bold">A</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[80px]">{match.team_a?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">vs</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[80px]">{match.team_b?.name}</span>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                        {match.team_b?.logo_url ? (
                          <img src={match.team_b.logo_url} alt="" className="w-5 h-5 object-contain" />
                        ) : (
                          <span className="text-white text-xs font-bold">B</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Pronostiqueurs */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy size={20} className="text-[#023e78]" />
              Top Pronostiqueurs
            </h2>
            <Link to="/leaderboard" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="space-y-3">
              {mappedLeaderboard.slice(0, 3).map((user, index) => (
                <TopUser
                  key={user.userId}
                  rank={user.rank}
                  initial={user.name?.charAt(0) || 'U'}
                  name={user.name}
                  points={user.points}
                  isFirst={index === 0}
                  isCurrentUser={user.userId === currentUser?.id}
                />
              ))}
            </div>

            {currentUserRank > 3 && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">Votre position</span>
                  </div>
                </div>
                <TopUser
                  rank={currentUserRank}
                  initial={currentUser?.firstname?.charAt(0) || currentUser?.name?.charAt(0) || 'U'}
                  name={currentUser?.firstname || currentUser?.name || 'Utilisateur'}
                  points={currentUserLeaderboard?.points || 0}
                  isFirst={false}
                  isCurrentUser={true}
                />
              </>
            )}

            {currentUserRank <= 3 && currentUserRank > 0 && (
              <div className="mt-4 bg-gradient-to-r from-[#f71a18] to-[#023e78] p-4 rounded-xl border border-[#f71a18]/20">
                <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                  <Star className="text-[#f71a18] fill-[#f71a18]" size={18} />
                  Félicitations ! Vous êtes dans le top 3 !
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacing for mobile nav */}
        {isMobile && <div className="h-16"></div>}
      </main>
    </div>
  );
};

export default UserDashboardPage;
