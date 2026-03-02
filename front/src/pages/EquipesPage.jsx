import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Trophy, Star, Shield, Home, Calendar } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import * as matchService from '@/api/matchService';

// Données factices pour démonstration
const mockTeams = [
  { id: '1', name: 'Lions Indomptables', logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg', total_players: 14 },
  { id: '2', name: 'Aigles du Fouta', logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg', total_players: 12 },
  { id: '3', name: 'Éléphants de Bafoussam', logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg', total_players: 15 },
  { id: '4', name: 'Requins de Douala', logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg', total_players: 13 },
  { id: '5', name: 'Panthères de Yaoundé', logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg', total_players: 11 },
  { id: '6', name: 'Buffles de Garoua', logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg', total_players: 14 },
];

const EquipesPage = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('equipes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const result = await matchService.getTeams();
        if (result.success && result.teams && result.teams.length > 0) {
          setTeams(result.teams);
        } else {
          setTeams(mockTeams);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams(mockTeams);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const isMobile = windowWidth < 768;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#023e78] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des équipes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Équipes - Tournoi de Douala 2026</title>
        <meta
          name="description"
          content="Découvrez toutes les équipes participantes au Tournoi de Douala 2026"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] relative">
        {/* Éléments décoratifs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="flex relative z-10">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${!isMobile ? 'ml-72' : ''} ${isMobile ? 'pt-20 pb-24' : 'pb-8'}`}>
            {/* Header */}
            <div className="px-6 lg:px-8 pt-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Home size={14} />
                <ChevronRight size={12} />
                <span className="font-medium text-[#023e78]">Équipes</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#023e78] to-[#023e78]/80 rounded-xl shadow-lg flex items-center justify-center">
                  <Shield size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#023e78]">Les Équipes</h1>
                  <p className="text-sm text-gray-500">
                    {teams.length} équipe{teams.length > 1 ? 's' : ''} participante{teams.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="px-6 lg:px-8">
              {teams.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                  <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Aucune équipe trouvée
                  </h3>
                  <p className="text-gray-500">
                    Les équipes seront bientôt disponibles
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {teams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:border-[#023e78]/30 transition-all"
                    >
                      {/* Team Header */}
                      <div className="relative bg-gradient-to-br from-[#023e78] to-[#023e78]/80 p-6">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                        </div>

                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
                            {team.logo_url ? (
                              <img
                                src={team.logo_url}
                                alt={team.name}
                                className="w-full h-full object-contain rounded-full"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-[#023e78]">
                                {team.name?.charAt(0)}
                              </span>
                            )}
                          </div>

                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-2 text-blue-100 text-sm">
                              <Trophy className="w-4 h-4" />
                              <span>Équipe #{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team Body */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {team.total_players || 0} joueurs
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[#023e78] text-sm font-semibold">
                            <Users className="w-4 h-4" />
                            <span>Effectif complet</span>
                          </div>
                        </div>

                        {/* View Roster Button */}
                        <Link
                          to={`/equipes/${team.id}/bordereau`}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#023e78] to-[#023e78]/80 hover:from-[#023e78]/80 hover:to-[#023e78] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 group/btn shadow-md hover:shadow-lg"
                        >
                          Voir le bordereau
                          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Bottom spacing for mobile nav */}
            {isMobile && <div className="h-16"></div>}
          </main>
        </div>
      </div>
    </>
  );
};

export default EquipesPage;
