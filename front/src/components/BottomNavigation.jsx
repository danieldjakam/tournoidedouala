import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Users, User, Shield } from 'lucide-react'; // Shield for admin? No, 'Teams' asked for team icon
// Using Users for Teams, Medal/Trophy for Leaderboard, Home for Home, User for Profile.
// Wait, "Matchs (ball icon)" -> Lucide doesn't have a perfect ball, maybe 'Calendar' or 'Activity'? Or 'Target'?
// I'll use 'Calendar' for matches as it fits schedule, or 'Target' for pronostics/matchs.
import { Calendar } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/dashboard', icon: Calendar, label: 'Matchs' }, // Dashboard is mainly matches/pronostics
    { to: '/dashboard?tab=leaderboard', icon: Trophy, label: 'Classement' }, // This requires handling query params or just routing to dashboard
    { to: '/dashboard?tab=teams', icon: Users, label: 'Équipes' }, // Should ideally be separate routes but dashboard has tabs
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary-blue' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;