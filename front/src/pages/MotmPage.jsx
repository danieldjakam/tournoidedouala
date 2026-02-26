import * as matchService from '@/api/matchService';
import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { ChevronRight, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MotmSection from '../components/DashboardUser/MotmSection';

const MotmPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("motm");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    try {
      const visibleMatches = matchService.getVisibleMatches();
      setMatches(visibleMatches);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] relative">

      {/* Background décoratif */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="flex relative z-10">

        {/* Sidebar globale (gère mobile + desktop) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Contenu principal */}
        <main className="flex-1 md:ml-72 p-6 lg:p-8 transition-all duration-300">

          {/* Fil d’Ariane */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Star size={14} />
              <ChevronRight size={12} />
              <span className="capitalize font-medium">MOTM</span>
            </div>
          </div>

          {/* Section MOTM */}
          <div className="animate-fadeIn">
            <MotmSection
              matches={matches}
              currentUser={currentUser}
            />
          </div>

        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MotmPage;