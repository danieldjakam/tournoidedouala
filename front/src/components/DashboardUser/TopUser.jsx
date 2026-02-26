import { Crown } from "lucide-react";

export default function TopUser({ rank, initial, name, points, isFirst, isCurrentUser = false }) {
  return (
    <div className={`
      p-4 rounded-xl flex items-center transition-all duration-300
      w-full
      ${isCurrentUser 
        ? 'bg-gradient-to-r from-[#023e78]/10 to-[#f71a18]/10 border-2 border-[#023e78] shadow-lg' 
        : 'bg-white border-2 border-[rgb(2,62,120)] hover:shadow-md'
      }
    `}>
      
      {/* Rang */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold
        ${isCurrentUser ? 'bg-[#023e78] text-white' : 'bg-gray-100 text-gray-700'}
      `}>
        {rank}
      </div>

      {/* Avatar avec initiale */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center mr-3 font-bold
        ${isFirst 
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
          : isCurrentUser
            ? 'bg-gradient-to-r from-[#023e78] to-[#0356a8] text-white'
            : 'bg-red-600 text-white'
        }
      `}>
        {initial}
      </div>

      {/* Informations utilisateur */}
      <div className="flex-1">
        <p className={`font-semibold ${isCurrentUser ? 'text-[#023e78]' : 'text-gray-800'}`}>
          {name} {isCurrentUser && '(Vous)'}
        </p>
        <p className="text-xs text-gray-500">{points} pts</p>
      </div>

      {/* Couronne pour le premier */}
      {isFirst && <span className="text-red-500 text-xl animate-pulse"> <Crown/> </span>}
      
      {/* Badge "Vous" pour mobile */}
      {isCurrentUser && !isFirst && (
        <span className="text-[10px] bg-[#023e78] text-white px-2 py-1 rounded-full ml-2">
          Vous
        </span>
      )}
    </div>
  );
}