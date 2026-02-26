import React, { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';
import * as pronosticService from '@/api/pronosticService';
import { cn } from '@/lib/utils';

const Leaderboard = ({ currentUserId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const data = pronosticService.calculateLeaderboard();
    setLeaderboard(data);
  }, []);

  const getMedalIcon = (position) => {
    if (position === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (position === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-primary-blue" />
        Classement général
      </h3>

      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Aucun pronostic enregistré pour le moment
          </p>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg transition-all border",
                entry.userId === currentUserId 
                  ? "bg-blue-50 border-primary-blue" 
                  : "bg-white border-gray-100 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center justify-center w-8 font-bold text-lg text-gray-500">
                {getMedalIcon(index) || (index + 1)}
              </div>

              <div className="flex-1">
                <div className="text-gray-900 font-bold">
                  {entry.name}
                  {entry.userId === currentUserId && (
                    <span className="ml-2 text-xs text-primary-blue bg-blue-100 px-2 py-0.5 rounded-full">(Vous)</span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {entry.matchPronostics} pronostic(s)
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-primary-blue">
                  {entry.points}
                </div>
                <div className="text-gray-400 text-[10px] uppercase">points</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h4 className="text-gray-900 font-bold text-sm mb-2">Système de points</h4>
        <ul className="text-gray-500 text-xs space-y-1">
          <li>• 3 points par pronostic de match correct</li>
          <li>• 10 points pour le vainqueur du tournoi</li>
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;