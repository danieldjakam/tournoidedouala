import { Crown, Medal, Star } from "lucide-react";

export default function TopUser({ rank, initial, name, points, isFirst, isCurrentUser = false }) {
  // Déterminer les styles en fonction du rang
  const getRankStyles = () => {
    if (isFirst) {
      return {
        container: "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300",
        rankBadge: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
        avatar: "bg-gradient-to-br from-yellow-400 to-orange-500 text-white",
        icon: <Crown className="text-yellow-500 fill-yellow-500" size={20} />
      };
    } else if (rank === 2) {
      return {
        container: "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300",
        rankBadge: "bg-gradient-to-br from-gray-400 to-gray-600 text-white",
        avatar: "bg-gradient-to-br from-gray-400 to-gray-600 text-white",
        icon: <Medal className="text-gray-500 fill-gray-500" size={18} />
      };
    } else if (rank === 3) {
      return {
        container: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300",
        rankBadge: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
        avatar: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
        icon: <Medal className="text-orange-500 fill-orange-500" size={18} />
      };
    } else {
      return {
        container: isCurrentUser 
          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300" 
          : "bg-white border-gray-200 hover:border-gray-300",
        rankBadge: isCurrentUser 
          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white" 
          : "bg-gray-100 text-gray-600",
        avatar: isCurrentUser 
          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white" 
          : "bg-gradient-to-br from-gray-400 to-gray-600 text-white",
        icon: isCurrentUser ? <Star className="text-blue-500 fill-blue-500" size={16} /> : null
      };
    }
  };

  const styles = getRankStyles();

  return (
    <div className={`
      p-4 rounded-2xl flex items-center transition-all duration-300 border-2 w-full
      ${styles.container}
      ${isCurrentUser ? 'shadow-md scale-[1.02]' : 'hover:shadow-sm'}
    `}>
      {/* Rang avec style */}
      <div className={`
        w-9 h-9 rounded-full flex items-center justify-center mr-3 font-bold text-sm shadow-md
        ${styles.rankBadge}
      `}>
        {rank}
      </div>

      {/* Avatar avec initiale */}
      <div className={`
        w-11 h-11 rounded-full flex items-center justify-center mr-3 font-bold text-lg shadow-md
        ${styles.avatar}
      `}>
        {initial}
      </div>

      {/* Informations utilisateur */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-semibold truncate ${isCurrentUser ? 'text-blue-700' : 'text-gray-800'}`}>
            {name}
          </p>
          {isCurrentUser && (
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
              Vous
            </span>
          )}
          {styles.icon && <span className="flex-shrink-0">{styles.icon}</span>}
        </div>
        <p className="text-xs text-gray-500 font-medium">{points} points</p>
      </div>

      {/* Points avec style */}
      <div className="flex-shrink-0 ml-3">
        <div className={`
          px-3 py-1.5 rounded-full text-sm font-bold
          ${isCurrentUser 
            ? 'bg-blue-600 text-white' 
            : isFirst 
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }
        `}>
          {points} pts
        </div>
      </div>
    </div>
  );
}
