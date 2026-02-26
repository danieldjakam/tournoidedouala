import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Lock, Rocket, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as matchService from '@/api/matchService';

const MatchCard = ({ match, isLocked, score, userPronostic }) => {
  const kickoffTime = new Date(match.kickoff_time);
  const showComposition = matchService.isCompositionVisible(match);

  return (
    <div className={cn(
      "bg-white rounded-lg p-6 border transition-all relative overflow-hidden",
      userPronostic 
        ? "border-2 border-primary-blue shadow-md" 
        : "border border-gray-200 hover:shadow-md",
      isLocked && "bg-gray-50 opacity-90"
    )}>
      {userPronostic && (
        <div className="absolute top-0 right-0 bg-primary-blue text-white px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center gap-1 z-10">
          <Rocket className="w-3 h-3" />
          PRONOSTIC FAIT
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <Clock className="w-4 h-4 text-primary-blue" />
          {format(kickoffTime, "dd MMM yyyy, HH:mm", { locale: fr })}
        </div>
        {isLocked && (
          <div className="flex items-center gap-1 text-accent-red text-sm font-bold uppercase tracking-wide mr-24 md:mr-0">
            <Lock className="w-4 h-4" />
            Verrouillé
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 items-center">
        {/* Team A */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mb-3 p-2 bg-gray-50 rounded-full border border-gray-100 relative group">
             <img 
               src={match.team_a?.logo_url} 
               alt={match.team_a?.name}
               className="w-full h-full object-contain"
             />
             {showComposition && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 w-3 h-3 rounded-full border-2 border-white" title="Composition disponible"></div>
             )}
          </div>
          <span className="text-gray-900 font-bold text-xs md:text-sm leading-tight line-clamp-2 h-8 md:h-auto flex items-center justify-center">
            {match.team_a?.name}
          </span>
        </div>

        {/* Center Status */}
        <div className="text-center relative">
          {score ? (
            <div className="text-3xl md:text-4xl font-black text-primary-blue tracking-tighter">
              {score.team_a_score} - {score.team_b_score}
            </div>
          ) : (
            <div className="text-2xl md:text-3xl font-black text-gray-200">VS</div>
          )}
          
          <div className={cn(
            "text-[10px] md:text-xs mt-3 px-2 md:px-3 py-1 rounded-full inline-block font-bold uppercase tracking-wider",
            match.status === 'upcoming' && "bg-blue-100 text-primary-blue",
            match.status === 'live' && "bg-red-100 text-accent-red animate-pulse",
            match.status === 'finished' && "bg-gray-100 text-gray-500"
          )}>
            {match.status === 'upcoming' && 'À venir'}
            {match.status === 'live' && 'En direct'}
            {match.status === 'finished' && 'Terminé'}
          </div>

          {!showComposition && match.status === 'upcoming' && (
            <div className="text-[10px] text-gray-400 mt-1 hidden md:block">
              Compo disponible H-1h
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mb-3 p-2 bg-gray-50 rounded-full border border-gray-100 relative group">
            <img 
              src={match.team_b?.logo_url} 
              alt={match.team_b?.name}
              className="w-full h-full object-contain"
            />
             {showComposition && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 w-3 h-3 rounded-full border-2 border-white" title="Composition disponible"></div>
             )}
          </div>
          <span className="text-gray-900 font-bold text-xs md:text-sm leading-tight line-clamp-2 h-8 md:h-auto flex items-center justify-center">
            {match.team_b?.name}
          </span>
        </div>
      </div>
      
      {userPronostic && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <span className="text-xs text-gray-500 uppercase font-semibold">Votre pronostic : </span>
          <span className="text-sm font-bold text-primary-blue ml-1">
            {userPronostic.pronostic === 'team_a' && match.team_a?.name}
            {userPronostic.pronostic === 'team_b' && match.team_b?.name}
            {userPronostic.pronostic === 'draw' && 'Match Nul'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchCard;