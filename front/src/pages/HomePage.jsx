import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, TrendingUp, Star, Award, Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useAnimation, useInView as useFramerInView } from 'framer-motion';
import { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import * as matchService from '@/api/matchService';

// Composant de compteur animé avec Intersection Observer de Framer Motion
const Counter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useFramerInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;

      const startValue = 0;
      const endValue = parseInt(end) || 0;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function pour un effet plus naturel
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * endValue);
        
        setCount(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        } else {
          setCount(endValue);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, end, duration]);

  // Nettoyer la valeur pour enlever le + si présent
  const cleanEnd = end.toString().replace('+', '');
  const displaySuffix = end.toString().includes('+') ? '+' : suffix;

  return (
    <span ref={ref} className="counter-value">
      {count}{displaySuffix}
    </span>
  );
};

// Composant d'équipe optimisé avec préchargement des images
const TeamCard = React.memo(({ team, index, isHovered, onHoverStart, onHoverEnd, inView }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const teamCardVariants = {
    hidden: { opacity: 0, y: 50, rotate: -5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: index * 0.05 // Délai réduit pour apparition plus rapide
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  if (!inView) return null;

  return (
    <motion.div 
      variants={teamCardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => onHoverStart(team.id)}
      onHoverEnd={onHoverEnd}
      className="flex flex-col items-center group relative"
    >
      <div className="relative">
        {/* Animated border */}
        <motion.div 
          className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-accent-red rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"
          animate={{ 
            rotate: isHovered ? 360 : 0
          }}
          transition={{ duration: 3, repeat: isHovered ? Infinity : 0, ease: "linear" }}
        />
        
        {/* Logo container */}
        <div className="relative w-36 h-36 md:w-40 md:h-40 mb-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-full border-4 border-gray-200 group-hover:border-primary-blue transition-all duration-500 shadow-lg group-hover:shadow-2xl overflow-hidden">
          {/* Shine effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
            animate={{ 
              x: isHovered ? ['-100%', '100%'] : '-100%'
            }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
          
          {/* Skeleton loader pendant le chargement de l'image */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-full" />
          )}
          
          <img 
            src={team.logo_url} 
            alt={team.name}
            className={`w-full h-full object-contain relative z-10 transition-all duration-300 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="eager" // Chargement prioritaire
            decoding="async"
          />

          {/* Fallback en cas d'erreur de chargement */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
              <span className="text-4xl font-bold text-gray-400">
                {team.name?.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Floating particles for hover effect */}
          {isHovered && imageLoaded && !imageError && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary-blue rounded-full"
                  initial={{ x: '50%', y: '50%', opacity: 1 }}
                  animate={{ 
                    x: `${50 + (i - 1) * 30}%`,
                    y: '-20%',
                    opacity: 0
                  }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              ))}
            </>
          )}
        </div>

        {/* Crown for top team */}
        {index === 0 && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="absolute -top-4 -right-2"
          >
            <div className="relative">
              <Trophy className="w-8 h-8 text-yellow-400 fill-current drop-shadow-lg" />
              <motion.div 
                className="absolute inset-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8 text-yellow-400 fill-current opacity-50" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Team name */}
      <h3 className="text-center font-bold text-gray-800 group-hover:text-primary-blue transition-colors text-sm md:text-base px-2">
        {team.name}
      </h3>

      {/* Team stats on hover */}
      {imageLoaded && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-semibold text-primary-blue whitespace-nowrap"
        >
          <Star className="w-3 h-3 inline mr-1 fill-current" />
          {Math.floor(Math.random() * 10) + 1} trophées
        </motion.div>
      )}
    </motion.div>
  );
});

TeamCard.displayName = 'TeamCard';

const HomePage = () => {
  const [teams, setTeams] = useState([]);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const teamsRef = useRef(null);
  const teamsInView = useFramerInView(teamsRef, { once: true, amount: 0.1 });

  useEffect(() => {
    // Chargement immédiat des équipes sans délai artificiel
    const teamsData = matchService.getTeams();
    setTeams(teamsData || []);
    setIsLoading(false);
  }, []);

  const stats = [{
    icon: Users,
    label: 'Équipes',
    value: teams.length.toString(),
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-600',
    delay: 0.2
  }, {
    icon: Calendar,
    label: 'Matchs',
    value: '16',
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-600',
    delay: 0.4
  }, {
    icon: TrendingUp,
    label: 'Participants',
    value: '500+',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-white',
    delay: 0.6
  }];

  // Animation variants pour les équipes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Stagger plus rapide
        delayChildren: 0.1
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Tournoi de Douala 2026 | Pronostics & Classements</title>
        <meta name="description" content="Participez au tournoi de football 2026 à Douala. Faites vos pronostics, gagnez des points et suivez le classement en direct." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col font-sans">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
          {/* ... (contenu hero inchangé) ... */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('assets/images/stade.jpg')",
              filter: "brightness(0.6)" 
            }}
          />
          
          {/* Animated Gradient Overlay */}
          <motion.div 
            animate={{ 
              background: [
                "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)",
                "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)",
                "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)"
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0"
          />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              {/* Animated Logo */}
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, delay: 1, repeat: Infinity }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 mx-auto mb-8 shadow-2xl border-4 border-primary-blue/50 relative"
              >
                <div className="absolute inset-0 rounded-full animate-ping bg-primary-blue/20" />
                <img 
                  src="https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg" 
                  alt="Logo Officiel" 
                  className="w-full h-full object-cover rounded-full relative z-10"
                />
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-lg"
                animate={{ 
                  textShadow: [
                    "0 0 30px rgba(0,102,204,0.3)",
                    "0 0 50px rgba(0,102,204,0.6)",
                    "0 0 30px rgba(0,102,204,0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                TOURNOI DE<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue via-white to-primary-blue animate-gradient">
                  DOUALA 2026
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl md:text-3xl text-gray-200 font-semibold mb-4"
              >
                La Compétition Ultime
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Rejoignez la passion du football camerounais. Faites vos pronostics, suivez les scores en direct et supportez votre équipe favorite.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-accent-red hover:bg-red-700 text-white px-10 py-8 text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                      <span className="relative z-10">REJOINDRE LE TOURNOI</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800"
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ opacity: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                </Link>
                
                <Link to="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-blue px-10 py-8 text-xl font-bold rounded-lg transition-all bg-transparent group">
                      VOIR LES RÉSULTATS
                      <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Stats with Counters */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.3 }} 
              className="m-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all relative overflow-hidden group"
                >
                  {/* Animated background */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20`}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <stat.icon className={`w-10 h-10 text-white mx-auto mb-3 relative z-10 group-hover:scale-110 transition-transform`} />
                  <div className="text-4xl font-black text-white mb-1 relative z-10">
                    <Counter end={stat.value} duration={4} />
                  </div>
                  <div className="text-gray-300 uppercase tracking-widest text-sm relative z-10">
                    {stat.label}
                  </div>
                  
                  {/* Pulse effect */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 h-1 ${stat.bgColor}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: stat.delay, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Teams Section - Optimisée */}
        <section ref={teamsRef} className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-blue rounded-full filter blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-red rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={teamsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Award className="w-16 h-16 text-primary-blue" />
              </motion.div>
              
              <h2 className="text-5xl font-black text-primary-blue mb-4 uppercase">
                Les Équipes en Lice
              </h2>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={teamsInView ? { width: "6rem" } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-1 bg-accent-red mx-auto mb-6"
              />
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {teams.length} équipes d'exception prêtes à en découdre pour le titre suprême
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={teamsInView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
            >
              {teams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  index={index}
                  isHovered={hoveredTeam === team.id}
                  onHoverStart={setHoveredTeam}
                  onHoverEnd={() => setHoveredTeam(null)}
                  inView={teamsInView}
                />
              ))}
            </motion.div>

          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};

export default HomePage;