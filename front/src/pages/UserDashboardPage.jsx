import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as matchService from '@/api/matchService';
import * as pronosticService from '@/api/pronosticService';
import { Menu, Award, Calendar, Home, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import Sidebar from "../components/layout/Sidebar";
import LiveMatch from "../components/DashboardUser/LiveMatch";
import Section from "../components/DashboardUser/Section";
import TopUser from "../components/DashboardUser/TopUser";
import HeaderDash from "../components/DashboardUser/HeaderDash";

const UserDashboardPage = () => {
  const { currentUser } = useAuth();
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

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Charger les données
  useEffect(() => {
    if (!currentUser) return;

    try {
      const visibleMatches = matchService.getVisibleMatches();
      setMatches(visibleMatches);
      setTeams(matchService.getTeams());
      calculateUserStats();

      const leaderboardData = pronosticService.calculateLeaderboard();
      setLeaderboard(leaderboardData);
      
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }, [currentUser]);

  // Pour Trouver le rang de l'utilisateur actuel
const currentUserRank = leaderboard.findIndex(user => user.userId === currentUser?.id) + 1;
const currentUserLeaderboard = leaderboard.find(user => user.userId === currentUser?.id);

  // Fonctions de calcul des stats
  const calculateWeeklyPoints = (userPronostics, scores) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let weeklyPoints = 0;
    
    userPronostics.forEach(prediction => {
      const score = scores.find(s => s.match_id === prediction.match_id);
      if (score) {
        const matchDate = new Date(score.date);
        if (matchDate >= oneWeekAgo) {
          const actualResult = score.team_a_score > score.team_b_score ? 'team_a' :
                              score.team_b_score > score.team_a_score ? 'team_b' : 'draw';
          if (prediction.pronostic === actualResult) {
            weeklyPoints += 3;
          }
        }
      }
    });
    
    return weeklyPoints;
  };

  const calculateLastWeekPoints = (userPronostics, scores) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let lastWeekPoints = 0;
    
    userPronostics.forEach(prediction => {
      const score = scores.find(s => s.match_id === prediction.match_id);
      if (score) {
        const matchDate = new Date(score.date);
        if (matchDate >= twoWeeksAgo && matchDate < oneWeekAgo) {
          const actualResult = score.team_a_score > score.team_b_score ? 'team_a' :
                              score.team_b_score > score.team_a_score ? 'team_b' : 'draw';
          if (prediction.pronostic === actualResult) {
            lastWeekPoints += 3;
          }
        }
      }
    });
    
    return lastWeekPoints;
  };

  const calculateUserStats = () => {
    try {
      const leaderboard = pronosticService.calculateLeaderboard();
      const currentUserStats = leaderboard.find(user => user.userId === currentUser.id);
      
      const allMatchPronostics = JSON.parse(localStorage.getItem('match_pronostics') || '[]');
      const scores = JSON.parse(localStorage.getItem('match_scores') || '[]');
      
      const userPronostics = allMatchPronostics.filter(p => p.user_id === currentUser.id);
      
      const weeklyPoints = calculateWeeklyPoints(userPronostics, scores);
      const lastWeekPoints = calculateLastWeekPoints(userPronostics, scores);
      
      setUserStats({
        totalPoints: currentUserStats?.points || 0,
        pronosticsCount: userPronostics.length,
        weeklyPoints,
        lastWeekPoints
      });
      
    } catch (error) {
      console.error("Erreur lors du calcul des stats:", error);
    }
  };

  if (!currentUser) return null;

  const isMobile = windowWidth < 768;
  const weeklyDifference = userStats.weeklyPoints - userStats.lastWeekPoints;
  const weeklyTrend = weeklyDifference > 0 ? '↑' : weeklyDifference < 0 ? '↓' : '→';
  const trendColor = weeklyDifference > 0 ? 'text-green-500' : weeklyDifference < 0 ? 'text-[#f71a18]' : 'text-gray-500';

  // Fonction pour rendre le contenu du dashboard (ex-DashboardHome)
  const renderDashboardContent = () => (

    
    <div className="w-full">
      {/* HeaderDash avec padding responsive */}
      <div className={isMobile ? 'px-0' : 'px-0 sm:px-1 lg:px-2'}>
        <HeaderDash currentUser={currentUser}/>
      </div>

      {/* Section Matchs en direct */}
      <div className={`
        mt-4 sm:mt-6 lg:mt-8
        ${isMobile ? 'px-0' : 'px-0 sm:px-1 lg:px-2'}
      `}>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 mb-3 sm:mb-4">
          <span className="w-1 h-6 sm:h-7 lg:h-8 bg-[#023e78] rounded-full"></span>
          Matchs en direct
        </h2>
        <LiveMatch />
      </div>

      {/* Section Top pronostiqueurs */}
      <div className={`
        mt-6 sm:mt-8 lg:mt-10
        ${isMobile ? 'px-0' : 'px-0 sm:px-1 lg:px-2'}
      `}>
        <Section 
          title="Top pronostiqueurs" 
          link="Classement"
          className="w-full"
        >
          {/* Top 3 des utilisateurs */}
          <div className="space-y-3">
            {leaderboard.slice(0, 3).map((user, index) => (
              <TopUser
                key={user.userId}
                rank={index + 1}
                initial={user.name?.charAt(0) || 'U'}
                name={user.name}
                points={user.points}
                isFirst={index === 0}
                isCurrentUser={user.userId === currentUser?.id}
              />
            ))}
          </div>

          {/* Section "Votre position" si l'utilisateur n'est pas dans le top 3 */}
          {currentUserRank > 3 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">Votre position</span>
                </div>
              </div>
              
              <div className="mt-4">
                <TopUser
                  rank={currentUserRank}
                  initial={currentUser?.firstname?.charAt(0) || currentUser?.pseudo?.charAt(0) || 'U'}
                  name={currentUser?.firstname || currentUser?.pseudo || 'Utilisateur'}
                  points={currentUserLeaderboard?.points || 0}
                  isFirst={false}
                  isCurrentUser={true}
                />
              </div>

            </div>
          )}

          {/* Message si l'utilisateur est dans le top 3 */}
          {currentUserRank <= 3 && (
            <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium flex items-center gap-2">
                <span className="text-yellow-500">  </span>
                Félicitations ! Vous êtes dans le top 3 ! <Star color="red" size={18}/>
              </p>
            </div>
          )}

          {/* Bouton voir tout sur mobile */}
          
            <div className="mt-6 text-center">
              <Link 
                to="/leaderboard"
                className="inline-flex items-center gap-2 text-[#023e78] font-medium hover:underline"
              >
                Voir tout le classement
                <TrendingUp size={16} />
              </Link>
            </div>
          
        </Section>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] relative">
      
      {/* Éléments décoratifs de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header mobile uniquement */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-[#023e78]/10 z-40 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#f71a18] rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="font-bold text-[#023e78]">Tournoi 2026</h1>
                <p className="text-xs text-gray-500">{currentUser.pseudo || `${currentUser.firstname} ${currentUser.name}`}</p>
              </div>
            </Link>
            
           
          </div>

          {/* Stats rapides mobiles */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-xl p-2 border border-[#023e78]/10">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-lg font-bold text-[#023e78]">{userStats.totalPoints}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#f71a18]/5 to-transparent rounded-xl p-2 border border-[#f71a18]/10">
              <p className="text-xs text-gray-500 mb-1">Pronos</p>
              <p className="text-lg font-bold text-[#f71a18]">{userStats.pronosticsCount}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-transparent rounded-xl p-2 border border-purple-100">
              <p className="text-xs text-gray-500 mb-1">Cette semaine</p>
              <p className="text-lg font-bold text-purple-600">{userStats.weeklyPoints}</p>
              <p className={`text-[10px] ${trendColor} mt-0.5 flex items-center gap-0.5`}>
                <TrendingUp size={10} />
                {weeklyTrend} {Math.abs(weeklyDifference)} pts
              </p>
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

      {/* Contenu principal */}
      <main className={`
        transition-all duration-300
        ${!isMobile ? 'ml-72' : ''}
        ${isMobile ? 'pt-48 px-3 pb-8' : 'p-4 lg:p-6 xl:p-8'}
      `}>
        
        {/* Sections */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {activeTab === "dashboard" && renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;