import { Eye, Calendar, Clock, Frown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as matchService from "@/api/matchService";

export default function LiveMatch() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState(null);

  // Récupérer les matchs en direct et le prochain match
  useEffect(() => {
    const fetchMatches = () => {
      try {
        // Récupérer tous les matchs visibles
        const allMatches = matchService.getVisibleMatches?.() || [];
        
        // Filtrer les matchs en direct
        const live = allMatches.filter(match => match.status === 'live');
        setLiveMatches(live);
        
        // Trouver le prochain match à venir
        if (live.length === 0) {
          const upcoming = allMatches
            .filter(match => match.status === 'upcoming')
            .sort((a, b) => new Date(a.kickoff_time) - new Date(b.kickoff_time));
          
          setNextMatch(upcoming[0] || null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des matchs:", error);
        setLoading(false);
      }
    };

    fetchMatches();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Rotation automatique des matchs en direct
  useEffect(() => {
    if (liveMatches.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setCurrentMatchIndex((prevIndex) => 
        prevIndex === liveMatches.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(rotationInterval);
  }, [liveMatches.length]);

  // Fonction pour obtenir le score en direct
  const getLiveScore = (matchId) => {
    try {
      return matchService.getMatchScore(matchId);
    } catch {
      return null;
    }
  };

  // Formater l'heure du prochain match
  const formatNextMatchTime = (kickoffTime) => {
    const date = new Date(kickoffTime);
    const now = new Date();
    const diffHours = Math.floor((date - now) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((date - now) / (1000 * 60));
      return `Dans ${diffMinutes} minutes`;
    } else if (diffHours < 24) {
      return `Dans ${diffHours} heures`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-10 px-6 w-lg mx-auto">
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl border border-gray-200 animate-pulse">
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <p className="text-gray-400">Chargement des matchs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // S'il y a des matchs en direct
  if (liveMatches.length > 0) {
    const currentMatch = liveMatches[currentMatchIndex];
    const liveScore = getLiveScore(currentMatch.id);

    return (
      <div className="mt-10 px-6 w-lg mx-auto">
        {/* En-tête avec indicateur live et compteur */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Match{liveMatches.length > 1 ? 's' : ''} en direct</h3>
            {liveMatches.length > 1 && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                {currentMatchIndex + 1}/{liveMatches.length}
              </span>
            )}
          </div>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold animate-pulse flex items-center gap-1">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            LIVE
          </span>
        </div>

        {/* Carte du match en direct */}
        <div className="mt-2 bg-gradient-to-br border-red-600 from-gray-50 to-white p-6 rounded-2xl shadow-xl border-2 relative overflow-hidden">
          
          {/* Effets de fond */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl"></div>
          
          {/* Indicateur de live animé */}
          <div className="absolute top-3 left-3">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
          </div>

          {/* Contenu du match */}
          <div className="flex justify-around items-center relative z-10">
            {/* Équipe domicile */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-gradient-to-br from-[#023e78] to-[#0356a8] rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                {currentMatch.team_a?.logo_url ? (
                  <img 
                    src={currentMatch.team_a.logo_url} 
                    alt={currentMatch.team_a.name}
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">A</span>
                )}
              </div>
              <div className="text-center max-w-[120px]">
                <span className="font-bold text-[rgb(2,62,120)] text-sm block leading-tight">
                  {currentMatch.team_a?.name || "Équipe A"}
                </span>
              </div>
            </div>

            {/* Score en direct */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-red-600">
                {liveScore ? `${liveScore.team_a_score} - ${liveScore.team_b_score}` : "0 - 0"}
              </h1>
              <p className="text-sm text-red-600 mt-1">En direct</p>
            </div>

            {/* Équipe extérieur */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-gradient-to-br from-[#023e78] to-[#0356a8] rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                {currentMatch.team_b?.logo_url ? (
                  <img 
                    src={currentMatch.team_b.logo_url} 
                    alt={currentMatch.team_b.name}
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">B</span>
                )}
              </div>
              <div className="text-center max-w-[120px]">
                <span className="font-bold text-[rgb(2,62,120)] text-sm block leading-tight">
                  {currentMatch.team_b?.name || "Équipe B"}
                </span>
              </div>
            </div>
          </div>

          {/* Bouton de détails */}
          <Link
            to={`/match/${currentMatch.id}`}
            className="mt-6 bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-xl flex justify-center items-center gap-3 hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg shadow-red-500/30 group"
          >
            <Eye size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold">Voir les détails du match</span>
          </Link>

          {/* Indicateurs de navigation */}
          {liveMatches.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {liveMatches.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMatchIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentMatchIndex 
                      ? 'w-6 bg-red-600' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Voir match ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // S'il n'y a pas de match en direct - Carte stylisée "Aucun match en direct"
  return (
    <div className="mt-10 px-6 w-lg mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Match en direct</h3>
        <span className="bg-gray-100 text-[#f71a18] px-3 py-1 rounded-full text-xs font-medium">
          Aucun live
        </span>
      </div>

      <div className="mt-2 bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden">
        
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gray-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gray-200/30 rounded-full blur-3xl"></div>
        
        {/* Pattern de points subtil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #023e78 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icône Frown avec animation */}
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Frown size={40} className="text-red-600" />
          </div>

          <h4 className="text-xl font-bold text-[#f71a18] mb-2">
            Aucun match en direct
          </h4>
          
          <p className="text-gray-500 mb-6 max-w-md">
            Il n'y a pas de match en cours pour le moment. 
            Revenez plus tard pour suivre les rencontres en direct !
          </p>

          {/* Prochain match à venir */}
          {nextMatch && (
            <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-[#023e78] mb-2">
                <Calendar size={16} />
                <span className="text-sm font-medium">Prochain match</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    {nextMatch.team_a?.logo_url ? (
                      <img src={nextMatch.team_a.logo_url} alt="" className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="text-white text-xs">A</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {nextMatch.team_a?.name} vs {nextMatch.team_b?.name}
                  </span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    {nextMatch.team_b?.logo_url ? (
                      <img src={nextMatch.team_b.logo_url} alt="" className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="text-white text-xs">B</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock size={14} />
                  <span className="text-xs font-medium">
                    {formatNextMatchTime(nextMatch.kickoff_time)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bouton pour voir tous les matchs */}
          <Link
            to="/matches"
            className="mt-6 bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-[#034b8c] hover:to-[#023e78] transition-all duration-300 shadow-lg shadow-[#023e78]/30 group"
          >
            <Calendar size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Voir tous les matchs à venir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}