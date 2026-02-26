import { Bell, Settings, Crown, TrendingUp, Award } from "lucide-react";

export default function HeaderDash({ currentUser, userStats = { totalPoints: 0, pronosticsCount: 0, weeklyPoints: 0 }, weeklyTrend = '→', trendColor = 'text-gray-500', weeklyDifference = 0 }) {
  
  if (!currentUser) return null;

  // Valeurs par défaut sécurisées
  const stats = {
    totalPoints: userStats?.totalPoints || 0,
    pronosticsCount: userStats?.pronosticsCount || 0,
    weeklyPoints: userStats?.weeklyPoints || 0
  };

  return (
    <div className="bg-gradient-to-r from-[rgb(2,62,120)] to-[rgb(124,155,184)] p-4 sm:p-6 pb-8 sm:pb-10 rounded-b-[30px] shadow-lg">
      
      {/* En-tête avec icônes */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-white/80 text-xs sm:text-sm">Bonjour,</p>
          <h1 className="text-white text-xl sm:text-2xl font-bold flex items-center gap-2">
            {currentUser.firstname || currentUser.pseudo || 'Utilisateur'}
            <Crown size={18} className="text-yellow-300" />
            
          </h1>
            <p className="text-white mt-2">
              Gérez vos pronostics et suivez votre progression
            </p>
        </div>

        <div className="flex gap-2 sm:gap-3 text-white">
          <button className="p-1.5 sm:p-2 hover:bg-white/10 rounded-xl transition-colors relative">
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#f71a18] rounded-full"></span>
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Settings size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carte des statistiques */}
      <div className="mt-4 sm:mt-6 bg-white/10 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Points totaux */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Award size={16} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-white/70">Total points</p>
              <p className="text-base sm:text-xl font-bold text-white">{stats.totalPoints}</p>
            </div>
          </div>

          {/* Séparateur (visible sur tablette/desktop) */}
          <div className="hidden sm:block w-px h-10 bg-white/20 justify-self-center"></div>

          {/* Pronostics */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">{stats.pronosticsCount}</span>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-white/70">Pronostics</p>
              <p className="text-base sm:text-xl font-bold text-white">effectués</p>
            </div>
          </div>

          {/* Séparateur (visible sur tablette/desktop) */}
          <div className="hidden sm:block w-px h-10 bg-white/20 justify-self-center"></div>

          {/* Points de la semaine */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-white/70">Cette semaine</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <p className="text-base sm:text-xl font-bold text-white">{stats.weeklyPoints}</p>
                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${trendColor} bg-white/20`}>
                  {weeklyTrend} {Math.abs(weeklyDifference)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}