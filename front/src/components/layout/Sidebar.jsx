import { useState } from "react";
import {
  Calendar,
  Target,
  Trophy,
  Star,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "matches", label: "Matchs", icon: Calendar, href: "/matches" },
  { id: "pronostics", label: "Pronostics", icon: Target, href: "/pronostics" },
  { id: "leaderboard", label: "Classement", icon: Trophy, href: "/leaderboard" },
  { id: "motm", label: "Vote MOTM", icon: Star, href: "/motm" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.href);
    setIsOpen(false); // ferme en mobile
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/*  BOUTON MOBILE */}
      <div className="md:hidden fixed top-4 right-4 z-[60] p-2 hover:bg-[#023e78]/5 rounded-xl transition-colors">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-[#023e78] rounded-lg shadow-md border"
        >
          <Menu size={22} />
        </button>
      </div>

      {/*  OVERLAY MOBILE */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/*  SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 p-6
          bg-gradient-to-br from-white via-[#f0f5fe] to-[#e8f0fe]
          border-r border-[#023e78]/10 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          z-50
          
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Bouton fermer mobile */}
        <div className="md:hidden flex justify-end mb-6">
          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 mb-12">
          <div
            className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer"
            onClick={() => handleNavigation(menu[0])}
          >
            <img
              src="https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg"
              className="rounded-full w-10 h-10"
            />
          </div>

          <div>
            <h2
              className="text-xl font-bold text-[#023e78] cursor-pointer"
              onClick={() => handleNavigation(menu[0])}
            >
              Tournoi 2026
            </h2>
            <p className="text-xs text-[#023e78]/60">
              Édition Championnat
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.href}
                onClick={() => handleNavigation(item)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-[#023e78] text-white shadow-md"
                      : "text-gray-600 hover:bg-white hover:text-[#023e78]"
                  }
                `}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-[#023e78]/10">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center gap-2 p-3 text-white rounded-xl transition ${
              isLoggingOut
                ? "bg-red-400 cursor-not-allowed"
                : "bg-[#f71a18] hover:bg-red-700"
            }`}
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">
              {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}